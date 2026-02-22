<?php

namespace App\Http\Controllers\App;

use App\Data\BookmarkData;
use App\Data\ContactData;
use App\Data\DocumentData;
use App\Data\DocumentTypeData;
use App\Data\ProjectData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentBulkEditRequest;
use App\Http\Requests\DocumentBulkMoveToTrashRequest;
use App\Http\Requests\DocumentRequest;
use App\Http\Requests\MultiDocUploadRequest;
use App\Http\Requests\ReceiptUploadRequest;
use App\Jobs\DocumentUploadJob;
use App\Jobs\ProcessMultiDocJob;
use App\Models\Bookmark;
use App\Models\Contact;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Project;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Log;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class DocumentController extends Controller
{
    public function index(Request $request): Response
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

        $filters = $request->input('filters', []);

        $search = $request->input('search', '');

        $documents = Document::query()
            ->applyFiltersFromObject($filters, [
                'allowed_filters' => ['document_type_id', 'project_id'],
                'allowed_operators' => ['=', '!=', 'like', 'scope'],
                'allowed_scopes' => ['contact', 'issuedBetween'],
            ])
            ->search($search)
            ->view($request->input('view'))
            ->with(['sender_contact', 'receiver_contact', 'type', 'project'])
            ->orderBy('is_pinned', 'DESC')
            ->orderBy('issued_on', 'DESC')
            ->paginate(20);

        $bookmarks = Bookmark::where('model', Document::class)->orderBy('name')->get();

        return Inertia::render('App/Document/DocumentIndex', [
            'documents' => Inertia::scroll(fn () => DocumentData::collect($documents)),
            'contacts' => ContactData::collect($contacts),
            'documentTypes' => DocumentTypeData::collect($types),
            'projects' => ProjectData::collect($projects),
            'currentFilters' => new Document()->getParsedFilters($request),
            'currentSearch' => $search,
            'filterContacts' => ContactData::collect($filterContacts),
            'filterTypes' => DocumentTypeData::collect($filterTypes),
            'filterProjects' => ProjectData::collect($filterProjects),
            'bookmark_model' => Document::class,
            'bookmarks' => BookmarkData::collect($bookmarks)
        ]);
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
            return redirect()->back()
                ->with('error', 'Document has no text content to analyze.');
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

    public function bulkRestore(DocumentBulkMoveToTrashRequest $request): RedirectResponse
    {
        $ids = $request->getDocumentIds();
        Document::withTrashed()->whereIn('id', $ids)->restore();

        return redirect()->back();
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
        $contacts = Contact::query()->with('company')->orderBy('name')->orderBy('first_name')->get();
        $projects = Project::query()->orderBy('name')->get();
        $documentTypes = DocumentType::query()->orderBy('name')->get();

        return Inertia::render('App/Document/DocumentEdit', [
            'document' => DocumentData::from($document),
            'contacts' => ContactData::collect($contacts),
            'projects' => ProjectData::collect($projects),
            'documentTypes' => DocumentTypeData::collect($documentTypes),
        ]);
    }

    public function update(DocumentRequest $request, Document $document): RedirectResponse
    {

        $document->update($request->validated());
        if (! $document->is_confirmed) {
            $document->is_confirmed = true;
            $document->save();
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

        return redirect()->route('app.document.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'trash',
                ],
            ],
        ])->with('success', 'Dokument wurde erfolgreich gelöscht.');
    }

    public function bulkForceDelete(DocumentBulkMoveToTrashRequest $request): RedirectResponse
    {
        $ids = $request->getDocumentIds();
        ray($ids);

        $documents = Document::whereIn('id', $ids)->withTrashed()->get();
        ray($documents->toArray());

        $documents->each(function ($document) {
            $file = $document->firstMedia('file');
            $file?->delete();

            $preview = $document->firstMedia('preview');
            $preview?->delete();

            $document->forceDelete();
        });

        return redirect()->route('app.document.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'trash',
                ],
            ],
        ])->with('success', 'Dokumente wurden erfolgreich gelöscht.');
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
