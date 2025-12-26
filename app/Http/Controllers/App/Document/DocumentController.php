<?php

namespace App\Http\Controllers\App\Document;

use App\Data\ContactData;
use App\Data\DocumentData;
use App\Data\DocumentTypeData;
use App\Data\ProjectData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentRequest;
use App\Http\Requests\ReceiptUploadRequest;
use App\Models\Contact;
use App\Models\Document;
use App\Models\DocumentType;
use App\Models\Project;
use Exception;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;
use Smalot\PdfParser\Parser;
use Throwable;
use Spatie\PdfToImage\Pdf;
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
        $document->firstMedia('file')->delete();
        $document->firstMedia('preview')->delete();
        $document->forceDelete();
        
        return redirect()->route('app.documents.documents.index');
    }

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws FileNotFoundException
     * @throws ForbiddenException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     * @throws Throwable
     */
    public function upload(ReceiptUploadRequest $request)
    {
        $files = $request->file('files');


            foreach ($files as $file) {

                $document = new Document();
                $document->filename = $file->getClientOriginalName();
                $document->title = pathinfo($file->getClientOriginalName())['filename'];
                $document->file_size = $file->getSize();
                $document->mime_type = $file->getMimeType();
                $document->checksum = hash_file('sha256', $file->getRealPath());
                $document->save();


                try {
                    $parser = new Parser();
                    $pdf = $parser->parseFile($file);
                    $metadata = $pdf->getDetails();

                    $document->pages = $metadata['Pages'] ?? 1;
                    $document->fulltext = $pdf->getText();

                    $creationDate = $metadata['CreationDate'] ?? null;
                    if (is_array($creationDate)) {
                        $creationDate = reset($creationDate);
                    }
                    $document->file_created_at = $creationDate ?? $file->getMTime();
                } catch (Exception) {
                    $document->pages = 1;
                    $document->fulltext = '';
                    $document->file_created_at = $file->getMTime();
                }

                $document->checksum = hash_file('sha256', $file->getRealPath());
                $document->issued_on = $document->file_created_at;


                $document->save();


                $media = MediaUploader::fromSource($file)
                    ->toDestination('s3_private', 'documents/'.$document->issued_on->format('Y/m/'))
                    ->upload();

                $document->attachMedia($media, 'file');

                try {
                    $tempFile = sys_get_temp_dir();
                    $previewFile = $tempFile.'/'.uniqid('preview_').'.jpg';

                    $ghostscriptPath = config('pdf.ghostscript_path');

                    if ($ghostscriptPath && $ghostscriptPath !== 'gs' && file_exists($ghostscriptPath)) {
                        putenv('MAGICK_GHOSTSCRIPT='.$ghostscriptPath);
                        putenv('PATH='.dirname($ghostscriptPath).':'.getenv('PATH'));
                    }

                    $pdfImage = new Pdf($file->getRealPath());
                    $pdfImage
                        ->thumbnailSize(250)
                        ->resolution(150)
                        ->save($previewFile);

                    $preview = MediaUploader::fromSource($previewFile)
                        ->toDestination('s3_private', 'documents/'.$document->issued_on->format('Y/m').'/previews/')
                        ->upload();

                    $document->attachMedia($preview, 'preview');

                    @unlink($previewFile);
                } catch (Exception $e) {
                    logger()->warning('Failed to generate PDF preview', [
                        'file' => $file->getClientOriginalName(),
                        'error' => $e->getMessage(),
                    ]);
                }
            }

        return redirect()->route('app.documents.documents.index')->with('success', 'File(s) uploaded successfully.');
    }
}
