<?php

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\CompanyData;
use App\Data\ContactData;
use App\Data\CostCenterData;
use App\Data\CurrencyData;
use App\Data\ReceiptData;
use App\Data\TransactionData;
use App\Facades\BookeepingRuleService;
use App\Facades\WeasyPdfService;
use App\Http\Controllers\Controller;
use App\Http\Requests\ReceiptsBulkDeleteRequest;
use App\Http\Requests\ReceiptUpdateRequest;
use App\Http\Requests\ReceiptUploadRequest;
use App\Jobs\DownloadJob;
use App\Jobs\ReceiptUploadJob;
use App\Models\Contact;
use App\Models\ConversionRate;
use App\Models\CostCenter;
use App\Models\Currency;
use App\Models\DocumentDownload;
use App\Models\NumberRange;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Transaction;
use Exception;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Plank\Mediable\Exceptions\MediaMoveException;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;
use Plank\Mediable\Media;
use Smalot\PdfParser\Parser;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Throwable;

class ReceiptController extends Controller
{
    private function applyReceiptQueryFilters($query, Request $request, ?string $search = ''): void
    {
        $query->applyDynamicFilters($request, [
            'allowed_filters' => ['contact_id', 'org_currency', 'cost_center_id'],
            'allowed_operators' => ['=', '!=', 'like', 'scope'],
            'allowed_scopes' => ['is_unpaid', 'issuedBetween', 'withoutBookings'],
        ])
            ->search($search ?? '')
            ->with([
                'account',
                'range_document_number',
                'contact',
                'cost_center',
            ])
            ->withSum('payableWithoutCurrencyDifference as payable_sum', 'amount')
            ->withAggregate(
                ['payable' => fn ($query) => $query->where('is_currency_difference', false)],
                'issued_on',
                'min'
            )
            ->orderByDesc('issued_on');
    }

    private function loadReceiptWithPayments(Receipt $receipt): void
    {
        $receipt->load([
            'account',
            'bookings',
            'range_document_number',
            'contact',
            'payable' => fn ($query) => $query->where('is_currency_difference', false)->with('transaction'),
        ])->loadSum('payableWithoutCurrencyDifference as payable_sum', 'amount');
    }

    private function getFormData(): array
    {
        return [
            'contacts' => CompanyData::collect(Contact::where('is_creditor', true)->orderBy('name')->get()),
            'cost_centers' => CostCenterData::collect(CostCenter::query()->orderBy('name')->get()),
            'currencies' => CurrencyData::collect(Currency::query()->orderBy('name')->get()),
        ];
    }

    public function index(Request $request)
    {
        $search = $request->input('search', '');

        $query = Receipt::query()->withCount('bookings');
        $this->applyReceiptQueryFilters($query, $request, $search);
        $receipts = $query->paginate();

        $contacts = Contact::where('is_creditor', true)->where('is_archived', false)->orderBy('name')->get();
        $currencies = Currency::query()->orderBy('name')->get();
        $costCenters = CostCenter::query()->orderBy('name')->get();

        if ($request->isMethod('POST')) {
            $receipts->appends($request->only(['filters', 'search']));
        } else {
            $receipts->appends($_GET)->links();
        }

        return Inertia::render('App/Bookkeeping/Receipt/ReceiptIndex', [
            'receipts' => ReceiptData::collect($receipts),
            'contacts' => ContactData::collect($contacts),
            'currencies' => CurrencyData::collect($currencies),
            'cost_centers' => CostCenterData::collect($costCenters),
            'currentFilters' => (new Receipt)->getParsedFilters($request),
            'currentSearch' => $search,
        ]);
    }

    /**
     * @throws Exception
     */
    public function printReport(Request $request): BinaryFileResponse
    {
        $search = $request->input('search', '');

        $query = Receipt::query();
        $this->applyReceiptQueryFilters($query, $request, $search);
        $receipts = $query->get();

        $activeFilters = (new Receipt)->getActiveFilterLabels($request, ['Suche']);

        $pdf = WeasyPdfService::createPdf('receipt-report', 'pdf.receipts.report',
            [
                'receipts' => $receipts,
                'activeFilters' => $activeFilters,
            ]);
        $filename = now()->format('Y-m-d-H-i').'-Auswertung-Eingangsrechnungen.pdf';

        return response()->inlineFile($pdf, $filename);
    }

    /**
     * Soft-delete receipt while preserving linked media for potential restoration.
     */
    public function destroy(Receipt $receipt): RedirectResponse
    {
        $receipt->delete();

        return redirect()->route('app.bookkeeping.receipts.index');
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
                'Content-Length' => $media->size,
            ]
        );
    }

    public function confirmFirst()
    {
        $receipt = Receipt::query()->where('is_confirmed', false)->orderBy('issued_on')->first();

        if (! $receipt) {
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
        $validated = $request->safe()->except('is_reconversion', 'org_amount');
        $wasConfirmed = $receipt->is_confirmed;

        $receipt->update($validated);

        if ($wasConfirmed && $request->validated('is_reconversion')) {
            $receipt->org_amount = $request->validated('org_amount');
            $conversion = ConversionRate::convertAmount($receipt->org_amount, $receipt->org_currency, $receipt->issued_on);
            if ($conversion) {
                $receipt->amount = $conversion['amount'];
                $receipt->exchange_rate = $conversion['rate'];
                $receipt->save();
            }
        }

        if (! $wasConfirmed) {
            if ($validated['org_currency'] !== 'EUR') {
                $receipt->is_foreign_currency = $receipt->org_currency !== 'EUR';
                $receipt->org_amount = $request->validated('amount');
                $conversion = ConversionRate::convertAmount($receipt->amount, $request->validated('org_currency'),
                    $receipt->issued_on);
                if ($conversion) {
                    $receipt->amount = $conversion['amount'];
                    $receipt->exchange_rate = $conversion['rate'];
                }
            }

            $receipt->is_confirmed = true;
            $receipt->duplicate_of = null;
            $receipt->save();

            $media = $receipt->firstMedia('file');
            $folder = '/bookkeeping/receipts/'.$receipt->issued_on->format('Y/m/');

            // Basis-Filename (Media->filename ist bereits OHNE Extension!)
            $baseFilename = $receipt->issued_on->format('Y-m-d').'-'.$media->filename;
            $filename = $baseFilename;
            $counter = 1;

            // Eindeutigen Dateinamen generieren, falls bereits vorhanden
            while (Media::where('disk', $media->disk)
                ->where('directory', trim($folder, '/'))
                ->where('filename', $filename)
                ->where('extension', $media->extension)
                ->where('id', '!=', $media->id)
                ->exists()) {
                $filename = $baseFilename.'-'.$counter;
                $counter++;
            }

            $receipt->org_filename = $media->filename;
            // move() erwartet filename MIT Extension
            $media->move($folder, $filename.'.'.$media->extension);

            // Nach Bestätigung zum nächsten unbestätigten Beleg weiterleiten
            $nextReceipt = Receipt::query()
                ->where('is_confirmed', false)
                ->orderBy('issued_on')
                ->first();

            if ($nextReceipt) {
                return redirect()->route('app.bookkeeping.receipts.confirm', ['receipt' => $nextReceipt->id]);
            }

            return redirect()->route('app.bookkeeping.receipts.index')
                ->with('message', 'Alle Belege sind bereits bestätigt.');
        }

        // Receipt neu aus DB laden, um aktualisierte Daten zu bekommen
        return back();
    }

    public function destroyPayment(Receipt $receipt, Transaction $transaction)
    {

        Payment::where('payable_type', Receipt::class)
            ->where('payable_id', $receipt->id)
            ->where('transaction_id', $transaction->id)
            ->forceDelete();

        return back();
    }

    public function createPayments(Receipt $receipt)
    {
        $this->loadReceiptWithPayments($receipt);

        $query = Transaction::query()
            ->orderByDesc('booked_on')
            ->whereRaw('amount - COALESCE((SELECT SUM(amount) FROM payments WHERE transaction_id = transactions.id), 0) < 0.00');

        if ($receipt->contact_id) {
            $query->where('counter_account_id', $receipt->contact->creditor_number)
                ->whereBetween('booked_on', [$receipt->issued_on->copy()->subMonths(2), $receipt->issued_on->copy()->addMonths(2)]);
        } else {
            $query->whereRaw('1 = 0');
        }

        $transactions = $query->paginate(5);

        return Inertia::render('App/Bookkeeping/Receipt/ReceiptLinkTransactions')
            ->with([
                'receipt' => ReceiptData::from($receipt),
                'transactions' => TransactionData::collect($transactions),
            ]);
    }

    public function storePayments(Request $request, Receipt $receipt)
    {

        $ids = $request->query('ids');
        $ids = $ids ? explode(',', $ids) : [];

        $transaction = Transaction::whereIn('id', $ids)->first();

        if (! $transaction->is_locked) {
            Transaction::createBooking($transaction);
        }

        $payment = new Payment;
        $payment->payable()->associate($receipt);
        $payment->transaction_id = $transaction->id;
        $payment->issued_on = $transaction->booked_on;
        $payment->is_currency_difference = false;
        $payment->amount = 0 - $receipt->amount;
        $payment->save();

        ReceiptController::checkForCurrencyDifference($receipt, $payment, $transaction);

        // Receipt komplett neu aus DB laden, um gecachte Relations zu umgehen
        $freshReceipt = Receipt::find($receipt->id);

        return $this->edit($freshReceipt);
    }

    public static function checkForCurrencyDifference(Receipt $receipt, Payment $payment, Transaction $transaction): ?Payment
    {
        if ($receipt->amount !== ($payment->amount * -1) && $receipt->org_currency !== 'EUR') {

            $currencyDiffPayment = Payment::where('payable_type', Receipt::class)
                ->where('payable_id', $receipt->id)
                ->where('transaction_id', $transaction->id)
                ->where('is_currency_difference', true)
                ->first();

            $currencyDiffPaymentId = $currencyDiffPayment ? $currencyDiffPayment->id : null;
            $differencePayment = Payment::firstOrNew(['id' => $currencyDiffPaymentId]);
            if (! $differencePayment->id) {
                $differencePayment->payable()->associate($receipt);
                $differencePayment->transaction_id = $transaction->id;
                $differencePayment->issued_on = $transaction->booked_on;
                $differencePayment->is_currency_difference = true;
            }

            $differencePayment->amount = $transaction->amount - $payment->amount;
            $differencePayment->save();

            Payment::createCurrencyDifferenceBookings($differencePayment);

            return $differencePayment;
        }

        return null;
    }

    public function checkReference(Request $request): RedirectResponse {
        $reference = $request->query('reference');

        if (!$reference) {
            return back();
        }

        $receipt = Receipt::where('reference', $reference)->first();
        if ($receipt) {
            Inertia::flash('toast', ['type' => 'warning', 'message' => 'Es gibt bereits einen Beleg mit der Referenz']);
        }
        return back();
    }

    public function edit(Receipt $receipt): Response
    {
        $this->loadReceiptWithPayments($receipt);
        $receipt->org_filename = $receipt->getOriginalFilename();

        return Inertia::render('App/Bookkeeping/Receipt/ReceiptEdit', [
            'receipt' => ReceiptData::from($receipt),
            ...$this->getFormData(),
        ]);
    }

    public function confirm(Receipt $receipt): Response|RedirectResponse
    {
        $receipt->load(['account', 'range_document_number', 'contact']);

        $receipts = Receipt::query()->where('is_confirmed', false)->orderBy('issued_on')->get();
        $currentIndex = $receipts->search(function ($item) use ($receipt) {
            return $item->id === $receipt->id;
        });

        if ($currentIndex === false) {

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

        return Inertia::render('App/Bookkeeping/Receipt/ReceiptConfirm', [
            'receipt' => ReceiptData::from($receipt),
            'nextReceipt' => $nextReceipt ? route('app.bookkeeping.receipts.confirm',
                ['receipt' => $nextReceipt->id]) : null,
            'prevReceipt' => $prevReceipt ? route('app.bookkeeping.receipts.confirm',
                ['receipt' => $prevReceipt->id]) : null,
            ...$this->getFormData(),
        ]);
    }

    public function uploadForm(): Response
    {
        return Inertia::render('App/Bookkeeping/Receipt/ReceiptUpload');
    }

    public function bulkDownload(Request $request): RedirectResponse
    {
        $ids = $request->query('ids');
        $ids = $ids ? explode(',', $ids) : [];

        $download = DocumentDownload::create([
            'type' => 'receipt',
            'ids' => $ids,
        ]);

        DownloadJob::dispatch($download->id, auth()->user());
        Inertia::flash('toast', ['type' => 'success', 'message' => 'Dein Download wird erstellt.']);

        return redirect()->back();

    }

    /**
     * @throws Exception
     */
    public function unlock(Receipt $receipt): RedirectResponse
    {
        $receipt->load('bookings');
        $hasLockedBooking = $receipt->bookings->contains(fn ($booking) => $booking->is_locked);

        if (! $hasLockedBooking) {
            $receipt->is_locked = false;
            $receipt->save();
        }

        return back();
    }

    public function lock(Request $request, ?Receipt $receipt): RedirectResponse|Response
    {
        $ids = $receipt?->id ?? $request->input('ids');

        if (empty($ids)) {
            return back();
        }

        $receiptIds = is_array($ids) ? $ids : explode(',', $ids);
        $receipts = Receipt::whereIn('id', $receiptIds)->orderBy('issued_on')->get();

        $receipts->each(function ($receipt) {
            if (! $receipt->is_locked) {
                $receipt->is_locked = true;

                if (! $receipt->number_range_document_numbers_id) {
                    $receipt->number_range_document_numbers_id = NumberRange::createDocumentNumber($receipt,
                        'issued_on');
                }

                $receipt->save();
                Receipt::createBooking($receipt);
            }
        });

        return redirect()->back();
    }

    /**
     * Soft-delete multiple receipts while preserving linked media for potential restoration.
     */
    public function bulkDelete(ReceiptsBulkDeleteRequest $request): RedirectResponse
    {
        $ids = $request->getReceiptIds();
        Receipt::whereIn('id', $ids)->where('is_locked', false)->delete();

        return redirect()->back();
    }

    public function runRules(Request $request)
    {

        $ids = $request->query('ids');
        $receiptIds = explode(',', $ids);

        BookeepingRuleService::run('receipts', new Receipt, $receiptIds);
        $receipts = Receipt::whereIn('id', $receiptIds)->get();
        Inertia::render('App/Bookkeeping/Receipt/ReceiptIndex', [
            'receipts' => Inertia::deepMerge($receipts)->matchOn('id'),
        ]);
    }

    // Die Datei existiert bereits und kann direkt verwendet werden
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
            $receipt = new Receipt;
            $receipt->org_filename = $file->getClientOriginalName();
            $receipt->file_size = $file->getSize();

            if ($file->getMimeType() === 'application/zip') {
                $tempPath = $file->store('temp/zip-uploads');
                $fullPath = storage_path('app/'.$tempPath);

                ReceiptUploadJob::dispatch($fullPath);

                return redirect()->route('app.bookkeeping.receipts.confirm-first');
            }

            try {
                $parser = new Parser;
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

            $receipt->save();

            BookeepingRuleService::run('receipts', new Receipt, [$receipt->id]);

            $receipt->refresh();
            if ($receipt->contact_id && ! $receipt->cost_center_id) {
                $receipt->cost_center_id = Contact::find($receipt->contact_id)?->cost_center_id;
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

        return redirect()->route('app.bookkeeping.receipts.confirm-first');
    }
}
