<?php

namespace App\Http\Controllers\App\Document;

use App\Data\ContactData;
use App\Data\DocumentData;
use App\Data\DocumentTypeData;
use App\Data\ProjectData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentRequest;
use App\Http\Requests\ReceiptUploadRequest;
use App\Jobs\DocumentUploadJob;
use App\Jobs\ProcessMultiDocJob;
use App\Models\Contact;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Throwable;

class DocumentController extends Controller
{

    public function index(Request $request)
    {
        $contactIds = Document::query()->select('contact_id')->distinct()->pluck('contact_id');
        $contacts = Contact::query()->whereIn('id', $contactIds)->orderBy('name')->get();

        $typeIds = Document::query()->select('document_type_id')->distinct()->pluck('document_type_id');
        $types = DocumentType::query()->whereIn('id', $typeIds)->orderBy('name')->get();

        $projectIds = Document::query()->select('project_id')->distinct()->pluck('project_id');
        $projects = Project::query()->whereIn('id', $projectIds)->orderBy('name')->get();

        $filters = $request->input('filters', []);

        $documents = Document::query()
            ->applyFiltersFromObject($filters, [
                'allowed_filters' => ['document_type_id', 'contact_id', 'project_id'],
                'allowed_operators' => ['=', '!=', 'like', 'scope'],
                'allowed_scopes' => ['view'],
            ])
            ->with('contact', 'type', 'project')
            ->orderBy('is_pinned', 'DESC')
            ->orderBy('issued_on', 'DESC')
            ->paginate(20);

        return Inertia::render('App/Document/Document/DocumentIndex', [
            'documents' => DocumentData::collect($documents),
            'contacts' => ContactData::collect($contacts),
            'documentTypes' => DocumentTypeData::collect($types),
            'projects' => ProjectData::collect($projects),
            'currentFilters' => $filters,
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

    public function restore(Document $document)
    {
        $document->restore();
        return redirect()->route('app.documents.documents.index');
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

    public function trash(Document $document)
    {
        $document->delete();
        $document->is_pinned = false;
        $document->save();
        return redirect()->route('app.documents.documents.index');
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
        return redirect()->route('app.documents.documents.index');
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

        return redirect()->route('app.documents.documents.index');
    }

    /**
     * @throws Throwable
     */

    public function multiDocUpload (Request $request) {
        $tempFile = storage_path('app/temp');
        if (!file_exists($tempFile)) {
            mkdir($tempFile, 0755, true);
        }
        $originalName = $request->file->getClientOriginalName();
        $fileName = uniqid().'_'.$originalName;
        $request->file->move($tempFile, $fileName);

        $realPath = $tempFile.'/'.$fileName;

        ProcessMultiDocJob::dispatch($realPath);

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

                DocumentUploadJob::dispatch($realPath, $originalName, $fileSize, $mimeType, $mTime);
            }

        return redirect()->route('app.documents.documents.index', [
            'filters' => [
                'view' => [
                    'operator' => 'scope',
                    'value' => 'inbox'
                ]
            ]
        ])->with('success', 'File(s) uploaded successfully.');
    }
}
