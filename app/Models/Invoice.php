<?php

namespace App\Models;

use App\Enums\InvoiceRecurringEnum;
use App\Facades\WeasyPdfService;
use App\Http\Controllers\App\TimeController;
use Carbon\Carbon;
use DateTime;
use Eloquent;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Plank\Mediable\Media;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableCollection;
use Plank\Mediable\MediableInterface;
use rikudou\EuQrPayment\QrPayment;
use Spatie\Holidays\Countries\Germany;
use Spatie\Holidays\Holidays;

/**
 * @property-read Contact|null $contact
 * @property-read float $amount_gross
 * @property-read float $amount_net
 * @property-read float $amount_open
 * @property-read float $amount_paid
 * @property-read float $amount_tax
 * @property-read string $document_number
 * @property-read string $filename
 * @property-read string $formated_invoice_number
 * @property-read array $invoice_address
 * @property-read string $qr_code
 * @property-read Contact|null $invoice_contact
 * @property-read Collection<int, InvoiceLine> $lines
 * @property-read int|null $lines_count
 * @property-read Contact|null $linked_invoice
 * @property-read Collection<int, Media> $media
 * @property-read int|null $media_count
 * @property-read Collection<int, Payment> $payable
 * @property-read int|null $payable_count
 * @property-read PaymentDeadline|null $payment_deadline
 * @property-read Project|null $project
 * @property-read NumberRangeDocumentNumber|null $range_document_number
 * @property-read Tax|null $tax
 * @property-read InvoiceType|null $type
 *
 * @method static MediableCollection<int, static> all($columns = ['*'])
 * @method static Builder<static>|Invoice byYear(int $year)
 * @method static MediableCollection<int, static> get($columns = ['*'])
 * @method static Builder<static>|Invoice newModelQuery()
 * @method static Builder<static>|Invoice newQuery()
 * @method static Builder<static>|Invoice query()
 * @method static Builder<static>|Invoice whereHasMedia($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Invoice whereHasMediaMatchAll($tags)
 * @method static Builder<static>|Invoice withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static Builder<static>|Invoice withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Invoice withMediaAndVariantsMatchAll($tags = [])
 * @method static Builder<static>|Invoice withMediaMatchAll(bool $tags = [], bool $withVariants = false)
 * @method static Builder<static>|Invoice unpaid()
 * @method static Builder<static>|Invoice view($view)
 *
 * @property-read BookkeepingBooking|null $booking
 *
 * @mixin Eloquent
 */
class Invoice extends Model implements MediableInterface
{
    use Mediable;

    protected $fillable = [
        'contact_id',
        'project_id',
        'invoice_number',
        'issued_on',
        'due_on',
        'dunning_block',
        'is_draft',
        'type_id',
        'service_provision',
        'vat_id',
        'address',
        'payment_deadline_id',
        'invoice_contact_id',
        'payment_deadline_id',
        'is_recurring',
        'recurring_interval_units',
        'recurring_interval',
        'recurring_next_billing_date',
        'recurring_begin_on',
        'recurring_end_on',
        'is_loss_of_receivables',
        'service_period_begin',
        'tax_id',
        'service_period_end',
        'sent_at',
        'additional_text',
    ];

    protected $attributes = [
        'dunning_block' => false,
        'project_id' => 0,
        'invoice_contact_id' => 0,
        'payment_deadline_id' => 0,
        'service_provision' => '',
        'is_loss_of_receivables' => false,
    ];

    protected $appends = [
        'formated_invoice_number',
        'invoice_address',
        'amount_net',
        'qr_code',
        'amount_tax',
        'amount_gross',
        'amount_open',
        'amount_paid',
    ];

    /**
     * @throws Exception
     */
    public static function createOrGetPdf(Invoice $invoice, bool $uploadToS3 = false): string
    {
        $invoice = Invoice::query()
            ->with('contact')
            ->with('project')
            ->with('parent_invoice')
            ->with('project.manager')
            ->with('contact.tax')
            ->with('payment_deadline')
            ->with('type')
            ->with([
                'lines' => function ($query) {
                    $query->with('rate')->orderBy('pos');
                },
            ])
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->where('id', $invoice->id)
            ->first();

        $times = Time::query()
            ->where('invoice_id', $invoice->id)
            ->with('project')
            ->withMinutes()
            ->with('category')
            ->with('user')
            ->whereNotNull('begin_at')
            ->orderBy('begin_at', 'desc')
            ->get();

        $groupedTimes = $times ? TimeController::groupByDate($times) : [];
        $groupedByCategoryTimes = $times ? TimeController::groupByCategoryAndDate($times) : [];
        $timesSum = $times ? $times->sum('mins') : 0;

        $taxes = $invoice->taxBreakdown($invoice->lines);
        $invoice->linked_invoices = $invoice->lines->filter(function ($line) {
            return $line->type_id === 9;
        });

        $invoice->lines = $invoice->lines->filter(function ($line) {
            return $line->type_id !== 9;
        });

        $bankAccount = BankAccount::orderBy('pos')->first();

        $bank_account = (object) [
            'iban' => $bankAccount->iban,
            'bic' => $bankAccount->bic,
            'account_owner' => $bankAccount->account_owner,
            'bank_name' => $bankAccount->bank_name,
        ];

        $pdfConfig = [];
        $pdfConfig['pdfA'] = ! $invoice->is_draft;
        $pdfConfig['hide'] = true;
        $pdfConfig['watermark'] = $invoice->is_draft ? 'ENTWURF' : '';

        return WeasyPdfService::createPdf('invoice', 'pdf.invoice.index',
            [
                'invoice' => $invoice,
                'taxes' => $taxes,
                'bank_account' => $bank_account,
                'groupedTimes' => $groupedTimes,
                'groupedByCategoryTimes' => $groupedByCategoryTimes,
                'timesSum' => $timesSum,
            ], $pdfConfig);
    }

    public function taxBreakdown(Collection $invoiceLines): array
    {
        $groupedEntries = [];
        foreach ($invoiceLines->groupBy('tax_rate_id') as $key => $value) {
            $groupedEntries[$key]['sum'] = $value->sum('tax');
            $groupedEntries[$key]['amount'] = $value->sum('amount');
            $groupedEntries[$key]['tax_rate'] = $value->first()->toArray()['rate'];
            $groupedEntries[$key]['tax_rate_id'] = $value->first()->toArray()['id'];
            // $sum = $sum + $groupedEntries[$key]['sum'];
        }

        return $groupedEntries;
    }

    public function scopeByYear(Builder $query, int $year): Builder
    {
        if ($year !== 0) {
            return $query->whereYear('issued_on', $year);
        }

        return $query;
    }

    public function setDueDate(): void
    {
        $paymentDeadline = PaymentDeadline::query()->where('id', $this->payment_deadline_id)->first();
        if ($paymentDeadline->exists()) {
            $dueDate = $this->issued_on->addDays($paymentDeadline->days);
            while ($dueDate->isWeekend() || Holidays::for(Germany::make('DE-NW'))->isHoliday($dueDate)) {
                $dueDate->addDays(1);
            }

            $this->due_on = $dueDate;
        }
    }

    public static function createRecurringInvoice(Invoice $invoice): Invoice
    {

        $lastInvoice = Invoice::query()->where('is_recurring', true)->where('parent_id', $invoice->id)->latest()->first();
        if (! $lastInvoice) {
            $lastInvoice = $invoice;
        }

        $recurringInvoice = static::duplicateInvoice($lastInvoice, true);
        $recurringInvoice->issued_on = $invoice->recurring_next_billing_date;
        $recurringInvoice->is_draft = 1;
        $recurringInvoice->invoice_number = null;
        $recurringInvoice->number_range_document_numbers_id = null;
        $recurringInvoice->sent_at = null;
        $recurringInvoice->parent_id = $invoice->id;

        if ($recurringInvoice->service_period_begin) {
            $parentInvoice = Invoice::find($invoice->id);
            $recurringInvoice->service_period_begin = $invoice->getDateForRecurringInterval($lastInvoice->service_period_begin, $parentInvoice->service_period_begin);
        }
        if ($recurringInvoice->service_period_end) {
            $parentInvoice = Invoice::find($invoice->id);
            $recurringInvoice->service_period_end = $invoice->getDateForRecurringInterval($lastInvoice->service_period_end, $parentInvoice->service_period_end);
        }

        $recurringInvoice->is_recurring = true;
        $recurringInvoice->recurring_next_billing_date = null;
        $recurringInvoice->recurring_begin_on = null;
        $recurringInvoice->recurring_end_on = null;
        $recurringInvoice->recurring_interval = null;
        $recurringInvoice->recurring_interval_units = 0;
        $recurringInvoice->setDueDate();
        $recurringInvoice->save();

        $recurringInvoice->load('lines');

        foreach ($recurringInvoice->lines as $line) {
            $latestLine = $lastInvoice->lines->where('id', $line->parent_id)->first();

            $currentLineId = $latestLine->id;
            $rootLine = null;
            while ($currentLineId) {
                $tempLine = InvoiceLine::find($currentLineId);
                if (! $tempLine || ! $tempLine->parent_id) {
                    $rootLine = $tempLine;
                    break;
                }
                $currentLineId = $tempLine->parent_id;
            }

            if ($latestLine->service_period_begin) {
                $newBegin = $invoice->getDateForRecurringInterval($latestLine->service_period_begin, $rootLine?->service_period_begin);
                $line->service_period_begin = $newBegin;
            }

            if ($latestLine->service_period_end) {
                $newEnd = $invoice->getDateForRecurringInterval($latestLine->service_period_end, $rootLine?->service_period_end);
                $line->service_period_end = $newEnd;
            }
            $line->save();
        }

        // $recurringInvoice->release();

        $invoice->recurring_next_billing_date = $invoice->getDateForRecurringInterval($recurringInvoice->issued_on);
        $invoice->save();

        return $recurringInvoice;
    }

    public function release(): void
    {
        if (! $this->invoice_number) {
            $counter = Invoice::whereYear('issued_on', $this->issued_on->year)->max('invoice_number');
            if ($counter == 0) {
                $counter = $this->issued_on->year * 100000;
            }

            $counter++;

            $this->invoice_number = $counter;
        }

        $this->setDueDate();
        $this->is_draft = false;

        if ($this->is_recurring) {
            if (! $this->recurring_begin_on) {
                $this->recurring_begin_on = $this->issued_on;
                $this->recurring_next_billing_date = $this->getNextBilligDate();
            } else {
                $this->recurring_next_billing_date = $this->recurring_begin_on;
            }

        }

        /*
        if (!$this->number_range_document_numbers_id) {
            $this->number_range_document_numbers_id = NumberRange::createDocumentNumber($this, 'issued_on');
        }
        if (!$releasedInvoice->hasMedia('pdf')) {
            Invoice::createOrGetPdf($releasedInvoice, true);

        */

        $this->save();

        /*
        $releasedInvoice = $this->refresh();
        $releasedInvoice
            ->load('lines')
            ->load('contact')
            ->load('project')
            ->load('lines')
            ->load('type')
            ->load('range_document_number')
            ->loadSum('lines', 'amount')
            ->loadSum('lines', 'tax')
            ->loadSum('payable', 'amount');

        Invoice::createBooking($releasedInvoice);
        */

        // return $releasedInvoice;
    }

    /**
     * Update invoice positions with validated line data
     *
     * @param  array<array<string, mixed>>  $linesData  Array of validated line data
     */
    public function updatePositions(array $linesData): void
    {
        $incomingIds = collect($linesData)
            ->pluck('id')
            ->filter()
            ->toArray();

        if (! empty($incomingIds)) {
            $this->lines()
                ->whereNotIn('id', $incomingIds)
                ->delete();
        } else {
            $this->lines()->delete();
        }

        foreach ($linesData as $index => $line) {
            $taxRate = TaxRate::where('id', $line['tax_rate_id'])->first();
            $amount = $line['type_id'] === 1 ? $line['quantity'] * $line['price'] : $line['amount'];

            // Convert date format from d.m.Y to Y-m-d for database
            $servicePeriodBegin = null;
            if (! empty($line['service_period_begin'])) {
                $date = Carbon::createFromFormat('d.m.Y', $line['service_period_begin']);
                if ($date instanceof Carbon) {
                    $servicePeriodBegin = $date->format('Y-m-d');
                }
            }

            $servicePeriodEnd = null;
            if (! empty($line['service_period_end'])) {
                $date = Carbon::createFromFormat('d.m.Y', $line['service_period_end']);
                if ($date instanceof Carbon) {
                    $servicePeriodEnd = $date->format('Y-m-d');
                }
            }

            $lineAttributes = [
                'invoice_id' => $this->id,
                'quantity' => $line['quantity'],
                'type_id' => $line['type_id'] ?? 1,
                'unit' => $line['unit'] ?? '',
                'tax_rate_id' => $line['tax_rate_id'] ?? null,
                'text' => $line['text'] ?? '',
                'price' => $line['price'] ?? 0,
                'amount' => $amount,
                'tax_rate' => $taxRate->rate ?? 0,
                'tax' => $amount / 100 * $taxRate->rate,
                'pos' => $line['type_id'] === 9 ? 999 : $line['pos'] ?? $index,
                'service_period_begin' => $servicePeriodBegin,
                'service_period_end' => $servicePeriodEnd,
            ];

            if ($line['id'] > 0) {
                InvoiceLine::where('id', $line['id'])
                    ->where('invoice_id', $this->id)
                    ->update($lineAttributes);
            } else {
                InvoiceLine::create($lineAttributes);
            }
        }
    }

    public static function createBooking($invoice): BookkeepingBooking
    {

        $invoice->load('range_document_number');
        if (! $invoice->range_document_number) {
            $invoice->number_range_document_numbers_id = NumberRange::createDocumentNumber($invoice,
                'issued_on');
            $invoice->save();
        }

        $booking = BookkeepingBooking::whereMorphedTo('bookable', Invoice::class)->where('bookable_id',
            $invoice->id)->first();

        $invoice->load('lines');
        $invoice->load('tax');
        $invoice->amount = $invoice->lines->sum('amount') + $invoice->lines->sum('tax');

        $outturnAccount = BookkeepingAccount::where('account_number', $invoice->tax->outturn_account_id)->first();

        $accounts = Contact::getAccounts(true, $invoice->contact_id, true, true);
        $booking = BookkeepingBooking::createBooking($invoice, 'issued_on', 'amount', $accounts['subledgerAccount'],
            $outturnAccount, 'A', $booking ? $booking->id : null);

        if ($booking) {
            $name = strtoupper($accounts['name']);
            $booking->booking_text = "Rechnungsausgang|$name|$invoice->formatedInvoiceNumber";
            $booking->save();
        }

        return $booking;
    }

    public function getFormatedInvoiceNumberAttribute(): string
    {
        if ($this->invoice_number) {
            return formated_invoice_id($this->invoice_number);
        }

        return 'Entwurf '.$this->id;
    }

    public function getInvoiceAddressAttribute(): array
    {
        if (empty($this->address)) {
            return [];
        }

        $address = explode("\n", $this->address);

        return array_filter($address, 'trim');
    }

    public function booking(): MorphOne
    {
        return $this->morphOne(BookkeepingBooking::class, 'bookable');
    }

    public function getFilenameAttribute(): string
    {
        return 'RG-'.str_replace('.', '_', basename($this->formated_invoice_number)).'.pdf';
    }

    public function getAmountNetAttribute(): float
    {
        return round($this->lines_sum_amount ?: 0, 2);
    }

    public function getAmountTaxAttribute(): float
    {

        return $this->lines_sum_tax ?: 0;

    }

    public function getAmountGrossAttribute(): float
    {
        return round($this->amount_net + $this->amount_tax, 2);
    }

    public function getAmountPaidAttribute(): float
    {
        return round($this->payable_sum_amount ?: 0, 2);
    }

    public function getAmountOpenAttribute(): float
    {
        return round($this->amount_gross - $this->amount_paid, 2);
    }

    public function getDocumentNumberAttribute(): string
    {
        if ($this->range_document_number) {
            return $this->range_document_number->document_number;
        }

        return '';
    }

    public function range_document_number(): HasOne
    {
        return $this->hasOne(NumberRangeDocumentNumber::class, 'id', 'number_range_document_numbers_id');
    }

    public static function duplicateInvoice(Invoice $invoice, bool $setParentId = false): Invoice
    {
        $duplicatedInvoice = $invoice->replicate();

        $duplicatedInvoice->issued_on = Carbon::now()->format('Y-m-d');
        $duplicatedInvoice->is_draft = 1;
        $duplicatedInvoice->invoice_number = null;
        $duplicatedInvoice->number_range_document_numbers_id = null;
        $duplicatedInvoice->sent_at = null;
        $duplicatedInvoice->save();

        $invoice->lines()->each(function ($line) use ($setParentId, $duplicatedInvoice) {
            $replicatedLine = $line->replicate();
            $replicatedLine->invoice_id = $duplicatedInvoice->id;
            if ($setParentId) {
                $replicatedLine->parent_id = $line->id;
            }
            $replicatedLine->save();
        });

        return $duplicatedInvoice;
    }

    public function getQrCodeAttribute(): string
    {
        if (! $this->contact || $this->amount_gross <= 0) {
            return '';
        }

        $purposeText = [];
        $purposeText[] = 'RG-'.$this->formated_invoice_number;
        $purposeText[] = 'K-'.number_format($this->contact->debtor_number, 0, ',', '.');

        $bankAccount = BankAccount::orderBy('pos')->first();

        $payment = new QrPayment($bankAccount->iban);
        $payment
            ->setBic($bankAccount->bic)
            ->setBeneficiaryName($bankAccount->account_owner)
            ->setAmount($this->amount_gross)
            ->setCurrency('EUR')
            ->setRemittanceText(implode(' ', $purposeText));

        return $payment->getQrCode()->getDataUri();
    }

    public function getNextBilligDate(): ?DateTime
    {
        if ($this->is_recurring) {
            return $this->getDateForRecurringInterval($this->issued_on);
        }

        return null;
    }

    public function getDateForRecurringInterval($date, ?Carbon $referenceDate = null): ?DateTime
    {
        if (! $date || ! $this->recurring_interval) {
            return null;
        }

        $dateCopy = $date->copy();

        // Use the reference date (original start date) to check if it was end of month
        // If no reference date is provided, use recurring_begin_on or issued_on from this invoice
        $originalDate = $referenceDate ?? ($this->recurring_begin_on ?? $this->issued_on);
        $wasOriginalEndOfMonth = $originalDate && $originalDate->isLastOfMonth();

        $newDate = match ($this->recurring_interval) {
            InvoiceRecurringEnum::days => $dateCopy->addDays($this->recurring_interval_units),
            InvoiceRecurringEnum::weeks => $dateCopy->addWeeks($this->recurring_interval_units),
            InvoiceRecurringEnum::months => $dateCopy->addMonthsNoOverflow($this->recurring_interval_units),
            InvoiceRecurringEnum::years => $dateCopy->addYearsNoOverflow($this->recurring_interval_units),
            default => null,
        };

        // If the original date was end of month, always set to end of target month
        // This ensures 31.01 -> 28.02 -> 31.03 -> 30.04 etc.
        if ($newDate && $wasOriginalEndOfMonth && $this->recurring_interval === InvoiceRecurringEnum::months) {
            if (! $newDate->isLastOfMonth()) {
                $newDate->endOfMonth();
            }
        }

        return $newDate;
    }

    public function lines(): HasMany
    {
        return $this->hasMany(InvoiceLine::class);
    }

    public function payable(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }



    public function contact(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function parent_invoice(): HasOne
    {
        return $this->hasOne(Invoice::class, 'id', 'parent_id');
    }

    public function offer(): HasOne
    {
        return $this->hasOne(Offer::class, 'id', 'offer_id');
    }

    public function invoice_contact(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'invoice_contact_id');
    }

    public function type(): HasOne
    {
        return $this->hasOne(InvoiceType::class, 'id', 'type_id');
    }

    public function tax(): HasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }

    public function project(): HasOne
    {
        return $this->hasOne(Project::class, 'id', 'project_id');
    }

    public function scopeUnpaid(Builder $query): Builder
    {
        $query
            ->where('is_draft', false)
            ->whereRaw('(
                SELECT COALESCE(SUM(amount), 0) 
                FROM invoice_lines 
                WHERE invoice_id = invoices.id
            ) - COALESCE((
                SELECT SUM(amount) 
                FROM payments 
                WHERE payable_type = ? AND payable_id = invoices.id
            ), 0) > 0.01', [Invoice::class]);

        return $query;
    }

    public function payment_deadline(): HasOne
    {
        return $this->hasOne(PaymentDeadline::class, 'id', 'payment_deadline_id');
    }

    public function scopeView(Builder $query, $view): Builder
    {
        return match ($view) {
            'unpaid' => $query->unpaid(),
            'drafts' => $query->where('is_draft', true),
            default => $query->where('is_draft', false)
        };
    }

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
            'due_on' => 'date',
            'sent_at' => 'datetime',
            'recurring_begin_on' => 'date',
            'recurring_end_on' => 'date',
            'recurring_next_billing_date' => 'date',
            'service_period_begin' => 'date',
            'service_period_end' => 'date',
            'is_loss_of_receivables' => 'boolean',
            'is_draft' => 'boolean',
            'recurring_interval' => InvoiceRecurringEnum::class,
        ];
    }
}
