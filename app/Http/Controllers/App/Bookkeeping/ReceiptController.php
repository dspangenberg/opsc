<?php

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\CompanyData;
use App\Data\CostCenterData;
use App\Data\CurrencyData;
use App\Data\ReceiptData;
use App\Data\TransactionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReceiptUpdateRequest;
use App\Http\Requests\ReceiptUploadRequest;
use App\Models\Contact;
use App\Models\ConversionRate;
use App\Models\CostCenter;
use App\Models\Currency;
use App\Models\NumberRange;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Transaction;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\Request;
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
        $receipts = Receipt::query()
            ->with([
                'account', 'range_document_number', 'contact','cost_center'
            ])
            ->withSum('payable', 'amount')
            ->orderBy('issued_on')->paginate();

        return Inertia::render('App/Bookkeeping/Receipt/ReceiptIndex', [
            'receipts' => ReceiptData::collect($receipts),
        ]);
    }

    public function destroy(Receipt $receipt)
    {

        $media = $receipt->firstMedia('file');
        $media->delete();
        $receipt->delete();
    }

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
        $receipt = Receipt::query()->where('is_confirmed', false)->orderBy('issued_on')->first();

        // Prüfung, ob unbestätigte Receipts existieren
        if (!$receipt) {
            // Redirect zur Hauptseite oder zeige eine Nachricht an, wenn keine Receipts zu bestätigen sind
            return redirect()->route('app.bookkeeping.receipts.index')
                ->with('message', 'Alle Belege sind bereits bestätigt.');
        }

        return redirect()->route('app.bookkeeping.receipts.confirm', ['receipt' => $receipt->id]);
    }

    /**
     * @throws MediaMoveException
     * @throws ConnectionException
     */
    public function update(ReceiptUpdateRequest $request, Receipt $receipt)
    {

        $receipt->issued_on = $request->validated('issued_on');
        $receipt->amount = $request->validated('amount');
        $receipt->org_currency = $request->validated('org_currency');

        if ($receipt->org_currency !== 'EUR' && (is_null($receipt->org_amount) || $receipt->org_amount == 0)) {
            $receipt->org_amount = $request->validated('amount');
            $receipt->is_foreign_currency = $receipt->org_currency !== 'EUR';
            $conversion = ConversionRate::convertAmount($receipt->amount, $request->validated('org_currency'), $receipt->issued_on);
            if ($conversion) {
                $receipt->amount = $conversion['amount'];
                $receipt->exchange_rate = $conversion['rate'];
            }
        }

        $receipt->reference = $request->validated('reference');
        $receipt->contact_id = $request->validated('contact_id');
        $receipt->cost_center_id = $request->validated('cost_center_id');


        $shouldConfirm = $request->query('confirm', false);
        $shouldLoadNext = $request->query('load_next', true);

        $receipt->save();

        if ($request->validated('is_confirmed') && $receipt->is_confirmed === false) {
            $receipt->is_confirmed = true;
            $receipt->save();
            if (!$receipt->number_range_document_numbers_id) {
                $receipt->number_range_document_numbers_id = NumberRange::createDocumentNumber($receipt, 'issued_on');
                $receipt->save();

                $receipt->load('range_document_number');
            }
            Receipt::createBooking($receipt);

            $media = $receipt->firstMedia('file');
            $folder = '/bookkeeping/receipts/'.$receipt->issued_on->format('Y/m/');
            $filename = $receipt->issued_on->format('Y-m-d').'-'.$receipt->range_document_number->document_number.'.pdf';


            $media->move($folder, $filename);
        }

        return redirect()->route('app.bookkeeping.receipts.confirm', ['receipt' => $receipt->id]);
    }

    /**
     */

    public function createPayments(Receipt $receipt) {
        $receipt->load(['account', 'range_document_number', 'contact']);

        $transactions = null;
        if ($receipt->contact_id) {
            $transactions = Transaction::query()
                ->where('counter_account_id', $receipt->contact->creditor_number)
                ->whereRaw('amount - COALESCE((SELECT SUM(amount) FROM payments WHERE transaction_id = transactions.id), 0) < 0.00')
                ->where('is_locked', true)
                ->get();
        }

        return Inertia::modal('App/Bookkeeping/Receipt/ReceiptLinkTransactions', [])
            ->with([
                'receipt' => ReceiptData::from($receipt),
                'transactions' => $transactions ? transactionData::collect($transactions) : null
            ])->baseRoute('app.bookkeeping.receipts.confirm', ['receipt' => $receipt->id]);
    }

    public function storePayments(Request $request, Receipt $receipt)
    {

        $ids = $request->query('ids');
        $ids = $ids ? explode(',', $ids) : [];
        $isCurrencyDifference = $request->query('remaining_amount_is_currency_difference');

        $transactions = Transaction::whereIn('id', $ids)->get();
        $transactions->each(function ($transaction) use ($receipt) {
            $payment = new Payment;
            $payment->payable()->associate($receipt);
            $payment->transaction_id = $transaction->id;
            $payment->issued_on = $transaction->booked_on;
            $payment->is_currency_difference = false;

            $payment->amount = $transaction->amount;
            $payment->save();
        });

        if ($isCurrencyDifference && $transactions->sum('amount') !== $receipt->amount) {
            $payment = new Payment;
            $payment->payable()->associate($receipt);
            $payment->issued_on = $receipt->issued_on;
            $payment->is_currency_difference = true;
            $payment->transaction_id = $ids[0];
            $payment->amount = $transactions->sum('amount') * -1 - ($receipt->amount);
            $payment->save();
            Payment::createCurrencyDifferenceBookings($payment);
        }

        return redirect()->route('app.bookkeeping.receipts.confirm', ['receipt' => $receipt->id]);

    }

    public function edit(Receipt $receipt)
    {
        $receipt->load(['account', 'range_document_number', 'contact']);


        $contacts = Contact::where('is_creditor', true)->orderBy('name')->get();
        $currencies = Currency::query()->orderBy('name')->get();
        $costCenters = CostCenter::query()->orderBy('name')->get();

        return Inertia::render('App/Bookkeeping/Receipt/ReceiptEdit', [
            'receipt' => ReceiptData::from($receipt),
            'contacts' => CompanyData::collect($contacts),
            'cost_centers' => CostCenterData::collect($costCenters),
            'currencies' => CurrencyData::collect($currencies),
        ]);
    }
    public function confirm(Receipt $receipt)
    {
        $receipt->load(['account', 'range_document_number', 'contact']);

        $receipts = Receipt::query()->where('is_confirmed', false)->orderBy('issued_on')->get();
        $currentIndex = $receipts->search(function ($item) use ($receipt) {
            return $item->id === $receipt->id;
        });

        // Prüfung, ob der Receipt in der Collection gefunden wurde
        if ($currentIndex === false) {
            // Falls der Receipt bereits bestätigt ist oder nicht in der Liste steht,
            // redirect zum ersten unbestätigten Receipt oder zur Hauptseite
            $firstUnconfirmed = $receipts->first();

            if ($firstUnconfirmed) {
                return redirect()->route('app.bookkeeping.receipts.confirm', ['receipt' => $firstUnconfirmed->id]);
            } else {
                return redirect()->route('app.bookkeeping.receipts.index')
                    ->with('message', 'Alle Belege sind bereits bestätigt.');
            }
        }

        $nextReceipt = $currentIndex < $receipts->count() - 1 ? $receipts[$currentIndex + 1] : null;
        $prevReceipt = $currentIndex > 0 ? $receipts[$currentIndex - 1] : null;

        $contacts = Contact::where('is_creditor', true)->orderBy('name')->get();
        $currencies = Currency::query()->orderBy('name')->get();
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

                $receipt->save();

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

                $uploadedReceipts[] = $receipt;
            }
        });

        Inertia::render('App/Bookkeeping/Receipt/ReceiptIndex', [
            'receipts' => Inertia::deepMerge($uploadedReceipts)->matchOn('id'),
        ]);
    }
}
