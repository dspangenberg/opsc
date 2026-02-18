<?php

namespace App\Services;

use App\Models\Document;
use Exception;
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
    public function upload(string $file, string $fileName, int $fileSize, string $fileMimeType, ?int $fileMTime = null, $label = null ): void
    {
        $document = new Document();
        $document->filename = $fileName;
        $document->title = pathinfo($fileName)['filename'];
        $document->file_size = $fileSize;
        $document->mime_type = $fileMimeType;
        $document->checksum = hash_file('sha256', $file);
        $document->label = $label;
        $document->save();


        try {
            $parser = new Parser();
            $pdf = $parser->parseFile($file);
            $metadata = $pdf->getDetails();

            $document->pages = $metadata['Pages'] ?? 1;
            $document->fulltext = $pdf->getText();

            // Use provided fileMTime if available, otherwise extract from PDF metadata
            if ($fileMTime !== null) {
                $document->file_created_at = $fileMTime;
            } else {
                $creationDate = $metadata['CreationDate'] ?? null;
                if (is_array($creationDate)) {
                    $creationDate = reset($creationDate);
                }
                $document->file_created_at = $creationDate ?? filemtime($file);
            }
        } catch (Exception) {
            $document->pages = 1;
            $document->fulltext = '';
            $document->file_created_at = $fileMTime ?? filemtime($file);
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
