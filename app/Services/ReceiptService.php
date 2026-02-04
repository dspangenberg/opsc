<?php

namespace App\Services;

use App\Facades\BookeepingRuleService;
use App\Models\Contact;
use App\Models\Receipt;
use Exception;
use Illuminate\Support\Str;
use Plank\Mediable\Facades\MediaUploader;
use Smalot\PdfParser\Parser;
use Zip;

class ReceiptService
{
    public function __construct()
    {
    }

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

        $receipt->checksum = hash_file('sha256', $file);
        $receipt->issued_on = $receipt->file_created_at;
        $receipt->save();

        $this->analizeFile($receipt);

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
    }

    public function analizeFile(Receipt $receipt): void
    {
        if ($receipt->text) {
            $ibanPattern = '/\bDE\s?[0-9]{2}(?:\s?[A-Z0-9]{4}){4}\s?[A-Z0-9]{2}\b/';
            preg_match($ibanPattern, $receipt->text, $matches);
            if (! empty($matches)) {
                foreach ($matches as $match) {
                    $cleanIban = preg_replace('/\s/', '', $match);
                    $contact = Contact::query()->where('iban', $cleanIban)->first();
                    if ($contact) {
                        $receipt->contact_id = $contact->id;
                        if ($contact->cost_center_id) {
                            $receipt->cost_center_id = $contact->cost_center_id;
                        }
                    }
                }
            }
        }
    }
}
