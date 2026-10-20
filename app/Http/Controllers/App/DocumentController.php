<?php

namespace App\Http\Controllers\App;

use App\Data\BookmarkData;
use App\Data\ContactData;
use App\Data\DocumentData;
use App\Data\DocumentTagData;
use App\Data\DocumentTypeData;
use App\Data\OfficeTemplateData;
use App\Data\ProjectData;
use App\Data\UserData;
use App\Facades\FileHelperService;
use App\Facades\OcrService;
use App\Facades\OfficeService;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentBulkEditRequest;
use App\Http\Requests\DocumentBulkMoveToTrashRequest;
use App\Http\Requests\DocumentRequest;
use App\Http\Requests\LetterCreateRequest;
use App\Http\Requests\MultiDocUploadRequest;
use App\Http\Requests\ReceiptUploadRequest;
use App\Jobs\DocumentUploadJob;
use App\Jobs\ProcessMultiDocJob;
use App\Models\Bookmark;
use App\Models\Contact;
use App\Models\Document;
use App\Models\DocumentTag;
use App\Models\DocumentType;
use App\Models\OfficeTemplate;
use App\Models\Project;
use App\Models\User;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Kettasoft\Filterable\Filterable;
use PhpOffice\PhpWord\Exception\CopyFileException;
use PhpOffice\PhpWord\Exception\CreateTemporaryFileException;
use Spatie\PdfToImage\Exceptions\PdfDoesNotExist;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class DocumentController extends Controller
{
    public function index(Request $request): Response|JsonResponse
    {
        $contacts = Contact::query()->orderBy('name')->orderBy('first_name')->get();
        $types = DocumentType::query()->orderBy('name')->get();
        $projects = Project::query()->orderBy('name')->get();

        $senderIds = Document::query()->distinct()->pluck('sender_contact_id')->filter();
        $receiverIds = Document::query()->distinct()->pluck('receiver_contact_id')->filter();
        $contactIds = $senderIds->merge($receiverIds)->unique();
        $filterContacts = Contact::whereIn('id', $contactIds)
            ->orderBy('name')->orderBy('first_name')->get();

        $typeIds = Document::query()->distinct()->pluck('document_type_id')->filter();
        $filterTypes = DocumentType::whereIn('id', $typeIds)->orderBy('name')->get();

        $projectIds = Document::query()->distinct()->pluck('project_id')->filter();
        $filterProjects = Project::whereIn('id', $projectIds)->orderBy('name')->get();

        $filterTags = DocumentTag::has('documents')->orderBy('name')->get();

        $search = $request->input('search', '');
        $filterTree = $this->filterTree($request);

        $query = Document::query();

        Filterable::for($query)
            ->using('tree')
            ->setAllowedFields([
                'title',
                'document_type_id',
                'project_id',
                'issued_on',
                'sender_contact_id',
                'receiver_contact_id',
            ])
            ->allowRelations([
                'tags' => ['id'],
            ])
            ->allowedOperators([
                'eq', 'neq', 'lt', 'lte', 'gt', 'gte',
                'like', 'nlike', 'in', 'nin',
                'between', 'nbetween', 'null', 'notnull',
            ])
            ->setData($filterTree)
            ->apply();

        $documents = $query
            ->search($search)
            ->view($request->input('view'))
            ->with(['sender_contact', 'receiver_contact', 'type', 'project', 'tags'])
            ->orderBy('is_pinned', 'DESC')
            ->orderBy('issued_on', 'DESC')
            ->paginate(20);

        $bookmarks = Bookmark::where('model', Document::class)->orderBy('name')->get();

        // Für den DocumentSelector (Angebote) benötigen wir die Daten im JSON-Format
        if ($request->expectsJson() === true) {
            $data = DocumentData::collect($documents);

            return response()->json($data->toJson());
        }

        return Inertia::render('App/Document/DocumentIndex', [
            'documents' => Inertia::scroll(fn () => DocumentData::collect($documents)),
            'contacts' => ContactData::collect($contacts),
            'documentTypes' => DocumentTypeData::collect($types),
            'projects' => ProjectData::collect($projects),
            'currentSearch' => $search,
            'filterContacts' => ContactData::collect($filterContacts),
            'filterTypes' => DocumentTypeData::collect($filterTypes),
            'filterProjects' => ProjectData::collect($filterProjects),
            'filterTags' => DocumentTagData::collect($filterTags),
            'bookmark_model' => Document::class,
            'bookmarks' => BookmarkData::collect($bookmarks),
        ]);
    }

    /**
     * Read the filter tree from the request, falling back to the empty default
     * tree when the tree is missing or malformed.
     *
     * @return array<string, mixed>
     */
    private function filterTree(Request $request): array
    {
        $tree = $request->input('filter');

        if (is_string($tree)) {
            $tree = json_decode($tree, true);
        }

        if (! $this->isValidFilterTree($tree)) {
            return $this->defaultFilterTree();
        }

        $tree = $this->withoutHiddenFilter($tree);

        return ($tree['and'] ?? $tree['or']) === [] ? $this->defaultFilterTree() : $tree;
    }

    /**
     * Drop legacy is_hidden nodes from the given filter tree.
     *
     * @param  array<string, mixed>  $tree
     * @return array<string, mixed>|null
     */
    private function withoutHiddenFilter(array $tree): ?array
    {
        if (isset($tree['field'])) {
            return $tree['field'] === 'is_hidden' ? null : $tree;
        }

        $combinator = array_key_exists('and', $tree) ? 'and' : 'or';
        $children = [];

        foreach ($tree[$combinator] as $node) {
            $child = is_array($node) ? $this->withoutHiddenFilter($node) : null;

            if ($child !== null) {
                $children[] = $child;
            }
        }

        return [$combinator => $children];
    }

    /**
     * Determine whether the given value is a valid filter tree node.
     */
    private function isValidFilterTree(mixed $tree): bool
    {
        if (! is_array($tree)) {
            return false;
        }

        if (isset($tree['and']) || isset($tree['or'])) {
            $group = $tree['and'] ?? $tree['or'];

            if (! is_array($group) || ! array_is_list($group) || $group === []) {
                return false;
            }

            foreach ($group as $node) {
                if (! $this->isValidFilterTree($node)) {
                    return false;
                }
            }

            return true;
        }

        return isset($tree['field']) && is_string($tree['field']);
    }

    /**
     * @return array<string, mixed>
     */
    private function defaultFilterTree(): array
    {
        return ['and' => []];
    }

    public function streamPreview(Document $document): StreamedResponse
    {
        $media = $document->firstMedia('preview');

        return response()->streamDownload(
            function () use ($media) {
                $stream = $media->stream();
                while ($bytes = $stream->read(1024)) {
                    echo $bytes;
                }
            },
            $media->basename,
            [
                'Content-Type' => $media->mime_type,
                'Content-Length' => $media->size,
            ]
        );
    }

    public function bulkEdit(DocumentBulkEditRequest $request): RedirectResponse
    {
        $ids = $request->getDocumentIds();
        $data = $request->safe()->except('ids');

        // Filter out null and 0 values
        $data = array_filter($data, fn ($value) => $value !== null && $value !== 0);

        if (! empty($data)) {
            $data['is_confirmed'] = true;
            Document::whereIn('id', $ids)->update($data);
        }

        return redirect()->back();
    }

    public function bulkMoveToTrash(DocumentBulkMoveToTrashRequest $request): RedirectResponse
    {
        $ids = $request->getDocumentIds();
        Document::whereIn('id', $ids)->delete();

        return redirect()->back();
    }

    /**
     * Extract information from document using AI service.
     *
     * @param  Document  $document  The document to process
     */
    public function getDocumentInfosFromAI(Document $document): RedirectResponse
    {
        // Validate that document has fulltext content
        if (empty($document->fulltext)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Das Dokument hat keinen Volltext.']);

            return redirect()->back()->with('error', 'Document has no fulltext.');
        }

        try {
            $document->extractFromFullText();

            return redirect()->back()
                ->with('success', 'Document information extracted successfully.');

        } catch (Exception $e) {
            // Log the exception for debugging
            Log::error('AI document extraction failed: '.$e->getMessage(), [
                'document_id' => $document->id,
                'error' => $e->getTraceAsString(),
            ]);

            return redirect()->back()
                ->with('error', 'Die Dokumentenverarbeitung konnte nicht abgeschlossen werden.');
        }
    }

    /**
     * @throws PdfDoesNotExist
     */
    public function runOCR(Document $document): RedirectResponse
    {
        if ($document->fulltext !== null && trim($document->fulltext) !== '') {
            Inertia::flash('toast', ['type' => 'info', 'message' => 'Das Dokument enthält bereits den Volltext.']);

            return redirect()->back();
        }

        $media = $document->firstMedia('file');
        if ($media === null) {
            Inertia::flash('toast',
                ['type' => 'error', 'message' => 'Für dieses Dokument wurde keine Datei gefunden.']);

            return redirect()->back();
        }

        $realPath = FileHelperService::createTemporaryFileFromDoc($media->filename, $media->contents());

        try {
            $fullText = OcrService::run($realPath);
        } finally {
            @unlink($realPath);
        }

        if (trim($fullText) === '') {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'OCR konnte keinen Volltext ermitteln.']);

            return redirect()->back();
        }

        $document->fulltext = $fullText;
        $document->save();

        return redirect()->back();
    }

    public function bulkRestore(DocumentBulkMoveToTrashRequest $request): RedirectResponse
    {
        $ids = $request->getDocumentIds();
        Document::withTrashed()->whereIn('id', $ids)->restore();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Die Dokumente wurden wiederhergestellt.']);

        return redirect()->route('app.document.index', ['view' => 'trash']);
    }

    public function restore(Document $document): RedirectResponse
    {
        $document->restore();

        return redirect()->route('app.document.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'trash',
                ],
            ],
        ])->with('success', 'Dokument wurde erfolgreich wiederhergestellt.');
    }

    public function streamPdf(Document $document): StreamedResponse
    {
        $media = $document->firstMedia('file');

        return response()->streamDownload(
            function () use ($media) {
                $stream = $media->stream();
                while ($bytes = $stream->read(1024)) {
                    echo $bytes;
                }
            },
            $document->filename,
            [
                'Content-Type' => $media->mime_type,
                'Content-Length' => $media->size,
            ]
        );
    }

    public function togglePinned(Request $request, Document $document): RedirectResponse
    {
        $document->is_pinned = ! $document->is_pinned;
        $document->save();

        $filters = $request->input('filters', []);

        return redirect()->route('app.document.index', [
            'filters' => $filters,
            'page' => 1,
        ]);
    }

    public function trash(Document $document): RedirectResponse
    {
        $document->is_pinned = false;
        $document->save();
        $document->delete();

        return redirect()->back();
    }

    public function edit(Document $document): Response
    {
        $document->load('tags');

        $contacts = Contact::query()
            ->with([
                'contacts' => function ($query) {
                    $query->with('salutation');
                },
            ])
            ->with('salutation')
            ->orderBy('name')
            ->orderBy('first_name')->get();
        $projects = Project::query()->orderBy('name')->get();
        $documentTypes = DocumentType::query()->orderBy('name')->get();
        $documentTags = DocumentTag::query()->orderBy('name')->get();

        return Inertia::render('App/Document/DocumentEdit', [
            'document' => DocumentData::from($document),
            'contacts' => ContactData::collect($contacts),
            'projects' => ProjectData::collect($projects),
            'documentTypes' => DocumentTypeData::collect($documentTypes),
            'documentTags' => DocumentTagData::collect($documentTags),
        ]);
    }

    public function createLetter(): Response
    {
        $contacts = Contact::query()->with('contacts')->where('is_org',
            true)->where('is_archived', false)->orderBy('name')->orderBy('first_name')->get();
        $templates = OfficeTemplate::query()->orderBy('name')->get();
        $users = User::query()->has('contact')->with('contact')->orderBy('last_name')->get();

        return Inertia::render('App/Document/DocumentCreateLetter', [
            'templates' => OfficeTemplateData::collect($templates),
            'contacts' => ContactData::collect($contacts),
            'users' => UserData::collect($users),
        ]);
    }

    /**
     * @throws CopyFileException
     * @throws CreateTemporaryFileException
     * @throws \PhpOffice\PhpWord\Exception\Exception
     */
    public function storeLetter(LetterCreateRequest $request): BinaryFileResponse
    {
        $docx = OfficeService::createOfficeLetter($request->validated());

        return response()->inlineFile($docx, 'word.docx')->deleteFileAfterSend();
    }

    public function update(DocumentRequest $request, Document $document): RedirectResponse
    {
        $document->update($request->validated());

        if (! $document->is_confirmed) {
            $document->is_confirmed = true;
            $document->save();
        }

        if ($request->has('tags')) {
            $tags = array_values(array_filter(
                $request->validated('tags') ?? [],
                static fn ($tag): bool => filled($tag),
            ));

            $document->tags()->sync($tags);
        }

        return redirect()->route('app.document.index');
    }

    public function uploadForm(): Response
    {
        return Inertia::render('App/Document/DocumentUpload');
    }

    public function forceDelete(Document $document): RedirectResponse
    {
        $file = $document->firstMedia('file');
        $file?->delete();

        $preview = $document->firstMedia('preview');
        $preview?->delete();

        $document->forceDelete();

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Das Dokument wurde endgültig gelöscht.']);

        return redirect()->route('app.document.index', ['view' => 'trash']);
    }

    public function bulkForceDelete(DocumentBulkMoveToTrashRequest $request): RedirectResponse
    {
        $ids = $request->getDocumentIds();
        $documents = Document::whereIn('id', $ids)->withTrashed()->get();

        $documents->each(function ($document) {
            $file = $document->firstMedia('file');
            $file?->delete();

            $preview = $document->firstMedia('preview');
            $preview?->delete();

            $document->forceDelete();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Die Dokumente wurden endgültig gelöscht.']);

        return redirect()->route('app.document.index', ['view' => 'trash']);
    }

    /**
     * @throws Throwable
     */
    public function multiDocUpload(MultiDocUploadRequest $request): RedirectResponse
    {
        $tempFile = storage_path('app/temp');
        if (! file_exists($tempFile)) {
            mkdir($tempFile, 0755, true);
        }
        $originalName = $request->file->getClientOriginalName();
        $fileName = uniqid().'_'.$originalName;
        $request->file->move($tempFile, $fileName);

        $realPath = $tempFile.'/'.$fileName;

        ProcessMultiDocJob::dispatch($realPath, $originalName);

        return redirect()->route('app.document.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'inbox',
                ],
            ],
        ])->with('success', 'File(s) uploaded successfully.');

    }

    public function upload(ReceiptUploadRequest $request): RedirectResponse
    {
        $files = $request->file('files');

        foreach ($files as $file) {

            $tempFile = storage_path('app/temp');
            if (! file_exists($tempFile)) {
                mkdir($tempFile, 0755, true);
            }

            // Get file info before moving
            $originalName = $file->getClientOriginalName();
            $fileSize = $file->getSize();
            $mimeType = $file->getMimeType();
            $mTime = $file->getMTime();

            $fileName = uniqid().'_'.$originalName;
            $file->move($tempFile, $fileName);

            $realPath = $tempFile.'/'.$fileName;

            DocumentUploadJob::dispatch($realPath, $originalName, $fileSize, $mimeType, $mTime, '');
        }

        return redirect()->route('app.document.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'inbox',
                ],
            ],
        ])->with('success', 'File(s) uploaded successfully.');
    }
}
