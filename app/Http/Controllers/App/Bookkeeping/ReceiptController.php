<?php

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\CompanyData;
use App\Data\ContactData;
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
use Gotenberg\Gotenberg;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Log;
use Plank\Mediable\Exceptions\MediaMoveException;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Exceptions\MediaUrlException;
use Plank\Mediable\Facades\MediaUploader;
use Spatie\PdfToText\Pdf;
use Throwable;

class ReceiptController extends Controller
{
    private function extractDateFromMetadata($metadata, $fileName)
    {
        // Verschiedene Wege versuchen, die Metadaten zu finden
        $fileMetadata = null;

        if (isset($metadata[$fileName])) {
            $fileMetadata = $metadata[$fileName];
        } elseif (is_array($metadata) && count($metadata) > 0) {
            $fileMetadata = reset($metadata); // Erstes Element nehmen
        }

        if (!$fileMetadata || !isset($fileMetadata['CreateDate'])) {
            return null;
        }

        $createDate = $fileMetadata['CreateDate'];

        // Verschiedene Datumsformate unterstützen
        $dateFormats = [
            'Y:m:d H:i:sP',  // 2025:05:12 09:42:02Z
            'Y:m:d H:i:s',   // 2025:05:12 09:42:02
            'Y-m-d H:i:s',   // 2025-05-12 09:42:02
        ];

        foreach ($dateFormats as $format) {
            try {
                return Carbon::createFromFormat($format, $createDate);
            } catch (\Exception $e) {
                continue;
            }
        }

        // Fallback: Versuche automatisches Parsen
        try {
            return Carbon::parse($createDate);
        } catch (\Exception $e) {
            \Log::warning('Konnte CreateDate nicht parsen: '.$createDate);
            return null;
        }
    }

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

        ds($request->validated());

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
                ds($receipt->toArray());
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
     * @throws MediaUrlException
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
        $files = $request->file('files'); // Array von Dateien
        $uploadedReceipts = [];

        DB::transaction(function () use ($files, &$uploadedReceipts) {
            foreach ($files as $file) {
                $receipt = new Receipt;
                $receipt->org_filename = $file->getClientOriginalName();
                $receipt->file_size = $file->getSize();

                $gotenbergUrl = config('services.gotenberg.url');
                try {
                    $response = Http::attach(
                        'files',
                        file_get_contents($file->getRealPath()),
                        $file->getClientOriginalName()
                    )->post($gotenbergUrl.'/forms/pdfengines/metadata/read');

                    if ($response->successful()) {
                        $metadata = $response->json();

                        // Datum aus Metadaten extrahieren
                        $extractedDate = $this->extractDateFromMetadata($metadata, $file->getClientOriginalName());
                        if ($extractedDate) {
                            $receipt->issued_on = $extractedDate;
                        } else {
                            $receipt->issued_on = Carbon::createFromTimestamp($file->getCTime());
                        }

                        $receipt->pages = $metadata[$file->getClientOriginalName()]['PageCount'];


                        ds('PDF Metadaten:', $metadata);
                    } else {
                        $receipt->issued_on = Carbon::createFromTimestamp($file->getCTime());
                        \Log::warning('Gotenberg Metadaten-Extraktion fehlgeschlagen: '.$response->body());
                    }
                } catch (\Exception $e) {
                    $receipt->issued_on = Carbon::createFromTimestamp($file->getCTime());
                    \Log::error('Fehler beim Lesen der PDF-Metadaten: '.$e->getMessage());
                }


                $receipt->file_created_at = $file->getMTime();
                $receipt->checksum = hash_file('sha256', $file->getRealPath());
                $receipt->text = Pdf::getText($file);
                $receipt->save();

                $media = MediaUploader::fromSource($file)
                    ->toDestination('s3_private', 'uploads/2025')
                    ->upload();

                $receipt->attachMedia($media, 'file');

                // Prüfung auf Duplikate
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
