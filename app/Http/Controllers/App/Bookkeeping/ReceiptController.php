<?php

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\CompanyData;
use App\Data\CostCenterData;
use App\Data\CurrencyData;
use App\Data\ReceiptData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReceiptUpdateRequest;
use App\Http\Requests\ReceiptUploadRequest;
use App\Models\Contact;
use App\Models\CostCenter;
use App\Models\Currency;
use App\Models\NumberRange;
use App\Models\Receipt;
use Exception;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Plank\Mediable\Exceptions\MediaMoveException;
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

class ReceiptController extends Controller
{

    public function index()
    {
        $receipts = Receipt::query()->with([
            'account', 'range_document_number', 'contact'
        ])->orderBy('issued_on')->paginate();
        return Inertia::render('App/Bookkeeping/Receipt/ReceiptIndex', [
            'receipts' => ReceiptData::collect($receipts),
        ]);
    }

    /**
     */

    public function streamPdf(Receipt $receipt)
    {
        $media = $receipt->firstMedia('file');
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
                'Content-Length' => $media->size
            ]
        );
    }

    public function confirmFirst()
    {
        $receipts = Receipt::query()->where('is_confirmed', false)->orderBy('id')->first();
        return redirect()->route('app.bookkeeping.receipts.confirm', ['receipt' => $receipts->id]);
    }

    /**
     * @throws MediaMoveException
     */
    public function update(ReceiptUpdateRequest $request, Receipt $receipt)
    {

        if ($request->validated('org_currency') === 'EUR') {
            $receipt->amount = $request->validated('amount');
        } else {
            $receipt->org_currency = $request->validated('org_currency');
        }
        $receipt->reference = $request->validated('reference');
        $receipt->contact_id = $request->validated('contact_id');
        $receipt->cost_center_id = $request->validated('cost_center_id');
        $receipt->issued_on = $request->validated('issued_on');

        $shouldConfirm = $request->query('confirm', false);
        $shouldLoadNext = $request->query('load_next', true);


        $receipt->save();

        if ($request->validated('is_confirmed') === true && !$receipt->is_confirmed) {
            $receipt->is_confirmed = true;
            if (!$receipt->number_range_document_number_id) {
                $receipt->number_range_document_number_id = NumberRange::createDocumentNumber($receipt, 'issued_on');
                $receipt->save();
                // $receipt->load('range_document_number');

            }

            $media = $receipt->firstMedia('file');
            $folder = '/bookkeeping/receipts/'.$receipt->issued_on->year.'/';
            $filename = $receipt->issued_on->format('Y-m-d').'-'.$media->filename;


            $media->move($folder, $filename);



        }

        $receipts = Receipt::query()->where('is_confirmed', false)->orderBy('id')->get();

        $currentIndex = $receipts->search(function ($item) use ($receipt) {
            return $item->id === $receipt->id;
        });

        $nextReceipt = $currentIndex < $receipts->count() - 1 ? $receipts[$currentIndex + 1] : null;

        Inertia::render('App/Bookkeeping/Receipt/ReceiptConfirm', [
            'receipt' => ReceiptData::from($receipt),
            'nextReceipt' => $nextReceipt ? route('app.bookkeeping.receipts.confirm',
                ['receipt' => $nextReceipt->id]) : null,
        ]);
    }

    /**
     */
    public function confirm(Receipt $receipt)
    {
        $receipt->load(['account', 'range_document_number', 'contact']);

        $receipts = Receipt::query()->where('is_confirmed', false)->orderBy('id')->get();
        $currencies = Currency::query()->orderBy('name')->get();

        $currentIndex = $receipts->search(function ($item) use ($receipt) {
            return $item->id === $receipt->id;
        });

        $nextReceipt = $currentIndex < $receipts->count() - 1 ? $receipts[$currentIndex + 1] : null;
        $prevReceipt = $currentIndex > 0 ? $receipts[$currentIndex - 1] : null;

        $contacts = Contact::where('is_creditor', true)->orderBy('name')->get();
        $costCenters = CostCenter::query()->orderBy('name')->get();

        return Inertia::render('App/Bookkeeping/Receipt/ReceiptConfirm', [
            'receipt' => ReceiptData::from($receipt),
            'nextReceipt' => $nextReceipt ? route('app.bookkeeping.receipts.confirm',
                ['receipt' => $nextReceipt->id]) : null,
            'prevReceipt' => $prevReceipt ? route('app.bookkeeping.receipts.confirm',
                ['receipt' => $prevReceipt->id]) : null,
            'contacts' => CompanyData::collect($contacts),
            'cost_centers' => CostCenterData::collect($costCenters),
            'currencies' => CurrencyData::collect($currencies),
        ]);
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
        $uploadedReceipts = [];

        DB::transaction(function () use ($files, &$uploadedReceipts) {
            foreach ($files as $file) {
                $receipt = new Receipt;
                $receipt->org_filename = $file->getClientOriginalName();
                $receipt->file_size = $file->getSize();

                try {
                    $parser = new Parser();
                    $pdf = $parser->parseFile($file);
                    $metadata = $pdf->getDetails();

                    $receipt->file_created_at = $metadata['CreationDate'] ?? $file->getMTime();
                    $receipt->pages = $metadata['Pages'] ?? 1;
                    $receipt->text = $pdf->getText();
                } catch (Exception) {
                    $receipt->file_created_at = $file->getMTime();
                    $receipt->pages = 1;
                    $receipt->text = '';
                }

                $receipt->checksum = hash_file('sha256', $file->getRealPath());
                $receipt->issued_on = $receipt->file_created_at;

                if ($receipt->text) {
                    // IBAN Pattern für deutsche/europäische IBANs
                    $ibanPattern = '/\bDE\s?[0-9]{2}(?:\s?[A-Z0-9]{4}){4}\s?[A-Z0-9]{2}\b/';
                    preg_match($ibanPattern, $receipt->text, $matches);
                    if (!empty($matches)) {
                        foreach ($matches as $match) {
                            $cleanIban = preg_replace('/\s/', '', $match);
                            $contact = Contact::query()->where('iban', $cleanIban);
                            if ($contact) {
                                $receipt->contact_id = $contact->first()->id;
                            }


                        }
                        // Optional: IBAN in der Datenbank speichern
                        // $receipt->iban = $matches[0][0];
                    }
                    $vatIdPattern = '/\b(DE\d{9}|AT[A-Z]\d{8}|BE0\d{9}|FR[A-Z0-9]{2}\d{9}|NL\d{9}B\d{2})\b/i';
                    preg_match($vatIdPattern, $receipt->text, $vatMatches);
                    if (!empty($vatMatches)) {
                        foreach ($vatMatches as $vatMatch) {
                            $cleanVatId = trim($vatMatch);
                            // VAT ID gefunden: z.B. DE240386270
                            // ds('VAT ID gefunden: ' . $cleanVatId);
                        }
                    }

                }

                $receipt->save();

                $media = MediaUploader::fromSource($file)
                    ->toDestination('s3_private', 'uploads/2025')
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

                $uploadedReceipts[] = $receipt;
            }
        });

        Inertia::render('App/Bookkeeping/Receipt/ReceiptIndex', [
            'receipts' => Inertia::deepMerge($uploadedReceipts)->matchOn('id'),
        ]);
    }
}
