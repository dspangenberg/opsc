<?php

namespace App\Services;

use App\Models\Document;
use Carbon\Carbon;
use Exception;
use App\Facades\MistralDocumentExtractorService;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;
use Smalot\PdfParser\Parser;
use Spatie\PdfToImage\Pdf;

class DocumentUploadService
{
    public function __construct()
    {
    }

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws FileNotFoundException
     * @throws ForbiddenException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     */
    public function upload(string $file, string $fileName, int $fileSize, string $fileMimeType, ?int $fileMTime = null, ?string $label = null, ?string $sourceFile = null): void
    {
        $document = new Document();
        $document->filename = $fileName;
        $document->title = pathinfo($fileName)['filename'];
        $document->file_size = $fileSize;
        $document->mime_type = $fileMimeType;
        $document->checksum = hash_file('sha256', $file);
        $document->label = $label;

        if ($sourceFile) {
            $document->source_file = $sourceFile;
        }

        $document->save();


        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($file);
            $metadata = $pdf->getDetails();

            $document->pages = $metadata['Pages'] ?? 1;
            $document->fulltext = $pdf->getText();

            // Extract AI information in a separate try-catch to preserve PDF parsing results
            if ($document->fulltext) {
                try {
                    $result = MistralDocumentExtractorService::extractInformation($document->fulltext);
                    
                    // Only assign if we have valid results
                    if (is_array($result) && (!empty($result['summary']) || !empty($result['subject']))) {
                        if (!empty($result['summary'])) {
                            $document->summary = $result['summary'];
                        }
                        if (!empty($result['subject'])) {
                            $document->title = $result['subject'];
                        }
                    }
                } catch (\Exception $e) {
                    // Log AI extraction error but don't modify PDF parsing results
                    \Log::warning('AI document extraction failed, preserving PDF parsing results', [
                        'document_id' => $document->id ?? 'not_yet_saved',
                        'error' => $e->getMessage(),
                    ]);
                }
            }

            // Use provided fileMTime if available, otherwise extract from PDF metadata
            if ($fileMTime !== null) {
                $document->file_created_at = Carbon::createFromTimestamp($fileMTime);
            } else {
                $creationDate = $metadata['CreationDate'] ?? null;
                if (is_array($creationDate)) {
                    $creationDate = reset($creationDate);
                }

                if ($creationDate) {
                    // Parse PDF date format examples:
                    // D:20220804120000+02'00', D:20220804120000Z, D:20220804120000
                    // Normalize by removing 'D:' prefix and all apostrophes
                    $normalizedDate = $creationDate;

                    // Remove 'D:' prefix if present
                    if (str_starts_with($normalizedDate, 'D:')) {
                        $normalizedDate = substr($normalizedDate, 2);
                    }

                    // Remove all apostrophes (e.g., +02'00' becomes +0200)
                    $normalizedDate = str_replace("'", '', $normalizedDate);

                    // Normalize trailing 'Z' to +0000 for Carbon compatibility
                    if (str_ends_with($normalizedDate, 'Z')) {
                        $normalizedDate = substr($normalizedDate, 0, -1) . '+0000';
                    }

                    try {
                        $document->file_created_at = Carbon::parse($normalizedDate);
                    } catch (Exception) {
                        $document->file_created_at = Carbon::createFromTimestamp(filemtime($file));
                    }
                } else {
                    $document->file_created_at = Carbon::createFromTimestamp(filemtime($file));
                }
            }
        } catch (Exception) {
            $document->pages = 1;
            $document->fulltext = '';
            $document->file_created_at = $fileMTime !== null
                ? Carbon::createFromTimestamp($fileMTime)
                : Carbon::createFromTimestamp(filemtime($file));
        }

        $document->checksum = hash_file('sha256', $file);
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

            $pdfImage = new Pdf($file);
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
                'file' => $file,
                'error' => $e->getMessage(),
            ]);
        }

        // Cleanup temp file
        @unlink($file);
    }
}
