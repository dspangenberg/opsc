<?php

namespace App\Http\Controllers\App;

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
use App\Models\Contact;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\RedirectResponse;
use Throwable;

class DocumentController extends Controller
{

    public function index(Request $request)
    {
        $contactIds = Document::query()->select('contact_id')->distinct()->pluck('contact_id');
        $contacts = Contact::query()->orderBy('name')->orderBy('first_name')->get();

        $typeIds = Document::query()->select('document_type_id')->distinct()->pluck('document_type_id');
        $types = DocumentType::query()->orderBy('name')->get();

        $projectIds = Document::query()->select('project_id')->distinct()->pluck('project_id');
        $projects = Project::query()->whereIn('id', $projectIds)->orderBy('name')->get();

        $filters = $request->input('filters', []);
        $page = $request->input('page', 1);


        $years = Document::query()->selectRaw('year(issued_on) as year')->distinct()->orderBy('year', 'DESC')->get();

        $documents = Document::query()
            ->applyFiltersFromObject($filters, [
                'allowed_filters' => ['document_type_id', 'contact_id', 'project_id'],
                'allowed_operators' => ['=', '!=', 'like', 'scope'],
                'allowed_scopes' => ['view'],
            ])
            ->with('contact', 'type', 'project')
            ->orderBy('is_pinned', 'DESC')
            ->orderBy('issued_on', 'DESC')
            ->paginate(24, ['*'], 'page', $page);

        $documentsPaginateProp = $documents->toArray();
        $isNextPage = $documentsPaginateProp['current_page'] < $documentsPaginateProp['last_page'];

        if (!$request->header('X-Inertia') && ($request->wantsJson() || $request->ajax())) {
            return response()->json([
                'documents' => DocumentData::collect($documents->items()),
                'page' => $documents->currentPage(),
                'from' => $documentsPaginateProp['from'],
                'to' => $documentsPaginateProp['to'],
                'total' => $documentsPaginateProp['total'],
                'contacts' => ContactData::collect($contacts),
                'documentTypes' => DocumentTypeData::collect($types),
                'projects' => ProjectData::collect($projects),
                'currentFilters' => $filters,
                'isNextPage' => $isNextPage
            ]);
        }

        return Inertia::render('App/Document/Document/DocumentIndex', [
            'documents' => Inertia::merge(DocumentData::collect($documents->items())),
            'page' => $documents->currentPage(),
            'from' => $documentsPaginateProp['from'],
            'to' => $documentsPaginateProp['to'],
            'total' => $documentsPaginateProp['total'],
            'contacts' => ContactData::collect($contacts),
            'documentTypes' => DocumentTypeData::collect($types),
            'projects' => ProjectData::collect($projects),
            'currentFilters' => $filters,
            'isNextPage' => $isNextPage
        ]);
    }

    public function streamPreview(Document $document)
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
        $data = array_filter($data, fn($value) => $value !== null && $value !== 0);

        if (!empty($data)) {
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

    public function bulkRestore(DocumentBulkMoveToTrashRequest $request): RedirectResponse
    {
        $ids = $request->getDocumentIds();
        Document::withTrashed()->whereIn('id', $ids)->restore();


        return redirect()->back();
    }

    public function restore(Document $document)
    {
        $document->restore();
        return redirect()->route('app.document.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'trash'
                ]
            ]
        ])->with('success', 'File(s) uploaded successfully.');
    }

    public function streamPdf(Document $document)
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
                'Content-Length' => $media->size
            ]
        );
    }

    public function togglePinned(Request $request, Document $document)
    {
        $document->is_pinned = !$document->is_pinned;
        $document->save();

        $filters = $request->input('filters', []);

        return redirect()->route('app.document.index', [
            'filters' => $filters,
            'page' => 1
        ]);
    }

    public function trash(Document $document)
    {
        $document->delete();
        $document->is_pinned = false;
        $document->save();
        return redirect()->back();
    }

    public function edit(Document $document) {
        $contacts = Contact::query()->with('company')->orderBy('name')->orderBy('first_name')->get();
        $projects = Project::query()->orderBy('name')->get();
        $documentType = DocumentType::query()->orderBy('name')->get();
        return Inertia::render('App/Document/Document/DocumentEdit', [
            'document' => DocumentData::from($document),
            'contacts' => ContactData::collect($contacts),
            'projects' => ProjectData::collect($projects),
            'documentTypes' => DocumentTypeData::collect($documentType),
        ]);
    }

    public function update(DocumentRequest $request, Document $document) {

        $document->update($request->validated());
        if (!$document->is_confirmed) {
            $document->is_confirmed = true;
            $document->save();
        }
        return redirect()->route('app.document.index');
    }

    public function uploadForm()
    {
        return Inertia::render('App/Document/Document/DocumentUpload');
    }

    public function forceDelete(Document $document)
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
                    'value' => 'trash'
                ]
            ]
        ])->with('success', 'File(s) uploaded successfully.');
    }

    public function bulkForceDelete(Request $request)
    {
        $ids = $request->query('document_ids');
        $ids = $ids ? explode(',', $ids) : [];

        $documents = Document::whereIn('id', $ids)->withTrashed()->get();


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
                    'value' => 'trash'
                ]
            ]
        ])->with('success', 'File(s) uploaded successfully.');
    }

    /**
     * @throws Throwable
     */

    public function multiDocUpload (MultiDocUploadRequest $request) {
        $tempFile = storage_path('app/temp');
        if (!file_exists($tempFile)) {
            mkdir($tempFile, 0755, true);
        }
        $originalName = $request->file->getClientOriginalName();
        $fileName = uniqid().'_'.$originalName;
        $request->file->move($tempFile, $fileName);

        $realPath = $tempFile.'/'.$fileName;

        ProcessMultiDocJob::dispatch($realPath);

        return redirect()->route('app.document.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'inbox'
                ]
            ]
        ])->with('success', 'File(s) uploaded successfully.');

    }
    public function upload(ReceiptUploadRequest $request)
    {
        $files = $request->file('files');


            foreach ($files as $file) {

                $tempFile = storage_path('app/temp');
                if (!file_exists($tempFile)) {
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
                    'value' => 'inbox'
                ]
            ]
        ])->with('success', 'File(s) uploaded successfully.');
    }
}
