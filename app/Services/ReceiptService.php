<?php

namespace App\Services;

use App\Facades\BookeepingRuleService;
use App\Facades\OcrService;
use App\Models\Contact;
use App\Models\Receipt;
use Exception;
use Illuminate\Support\Str;
use Log;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;
use Smalot\PdfParser\Parser;
use Spatie\PdfToImage\Exceptions\PdfDoesNotExist;
use Zip;

class ReceiptService
{

    /**
     * @throws Exception
     */
    public function processZipArchive(string $file): void
    {
        $zip = Zip::open($file);

        $files = [];
        foreach ($zip->listFiles() as $zipFile) {
            if (! Str::startsWith($zipFile, ['.DS_Store', '__MACOSX', '.', '..'])) {
                $files[] = $zipFile;
            }
        }

        foreach ($files as $zipFile) {
            $tempFile = sys_get_temp_dir();
            $result = $zip->extract($tempFile, $zipFile);
            $pdfFile = $tempFile.'/'.$zipFile;
            if ($result) {

                if (! is_dir($pdfFile)) {
                    $orgFilename = basename($zipFile);
                    $filesize = filesize($pdfFile);
                    $this->processFile($pdfFile, $orgFilename, $filesize);
                }
            }
        }
    }

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws FileNotFoundException
     * @throws ForbiddenException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     * @throws PdfDoesNotExist
     */
    public function processFile(string $file, string $orgFilename, int $size): void
    {
        $receipt = new Receipt;
        $receipt->org_filename = $orgFilename;
        $receipt->file_size = $size;
        $receipt->pages = 1;
        $receipt->text = '';

        try {
            $parser = new Parser;
            $pdf = $parser->parseFile($file);
            $metadata = $pdf->getDetails();
            $receipt->file_created_at = $metadata['CreationDate'] ?? filemtime($file);
            $receipt->pages = $metadata['Pages'] ?? 1;
            $receipt->text = $pdf->getText();
        } catch (Exception) {
            $receipt->file_created_at = filemtime($file);
        }

        if (! $receipt->text) {
            $receipt->text = OcrService::run($file);
        }

        $receipt->checksum = hash_file('sha256', $file);
        $receipt->issued_on = $receipt->file_created_at;
        $receipt->save();

        BookeepingRuleService::run('receipts', new Receipt, [$receipt->id]);

        $receipt->refresh();
        if ($receipt->contact_id && ! $receipt->cost_center_id) {
            $receipt->cost_center_id = Contact::find($receipt->contact_id)->cost_center_id;
            $receipt->save();
        }

        $media = MediaUploader::fromSource($file)
            ->toDestination('s3_private', 'uploads/'.$receipt->issued_on->format('Y/m/'))
            ->upload();

        $receipt->attachMedia($media, 'file');

        $duplicatedReceipt = Receipt::query()
            ->where('id', '!=', $receipt->id)
            ->where('checksum', $receipt->checksum)
            ->where('org_filename', $receipt->org_filename)
            ->where('file_size', $receipt->file_size)
            ->first();

        if ($duplicatedReceipt) {
            $receipt->duplicate_of = $duplicatedReceipt->id;
            $receipt->save();
        }

        try {
            $receipt->extractInvoiceData();
        } catch (Exception $e) {
            // Log generic extraction error but don't lose PDF parsing/checksum/media/upload work
            Log::warning('AI receipt extraction failed, preserving PDF parsing results', [
                'receipt_id' => $receipt->id,
                'error' => $e->getMessage(),
                'stack_trace' => $e->getTraceAsString(),
            ]);
        }

    }
}
