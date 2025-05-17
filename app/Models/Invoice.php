<?php

namespace App\Models;

use App\Services\PdfService;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Support\Carbon;
use Mpdf\MpdfException;
use Plank\Mediable\Media;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableCollection;
use Plank\Mediable\MediableInterface;
use rikudou\EuQrPayment\QrPayment;
use Spatie\TemporaryDirectory\Exceptions\PathAlreadyExists;

/**
 * @property int $id
 * @property int $contact_id
 * @property int $project_id
 * @property int $invoice_number
 * @property Carbon $issued_on
 * @property Carbon $due_on
 * @property int $dunning_block
 * @property int $is_draft
 * @property int $type_id
 * @property string $service_provision
 * @property string $vat_id
 * @property string $address
 * @property int $payment_deadline_id
 * @property Carbon|null $sent_at
 * @property int $legacy_id
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $number_range_document_numbers_id
 * @property string|null $service_period_begin
 * @property string|null $service_period_end
 * @property int $invoice_contact_id
 * @property-read Contact|null $contact
 * @property-read string $document_number
 * @property-read string $filename
 * @property-read string $formated_invoice_number
 * @property-read string $qr_code
 * @property-read Collection<int, InvoiceLine> $lines
 * @property-read int|null $lines_count
 * @property-read Collection<int, Media> $media
 * @property-read int|null $media_count
 * @property-read Collection<int, Payment> $payable
 * @property-read int|null $payable_count
 * @property-read PaymentDeadline|null $payment_deadline
 * @property-read Project|null $project
 * @property-read NumberRangeDocumentNumber|null $range_document_number
 *
 * @method static MediableCollection<int, static> all($columns = ['*'])
 * @method static MediableCollection<int, static> get($columns = ['*'])
 * @method static Builder|Invoice newModelQuery()
 * @method static Builder|Invoice newQuery()
 * @method static Builder|Invoice query()
 * @method static Builder|Invoice whereAddress($value)
 * @method static Builder|Invoice whereContactId($value)
 * @method static Builder|Invoice whereCreatedAt($value)
 * @method static Builder|Invoice whereDueOn($value)
 * @method static Builder|Invoice whereDunningBlock($value)
 * @method static Builder|Invoice whereHasMedia($tags = [], bool $matchAll = false)
 * @method static Builder|Invoice whereHasMediaMatchAll($tags)
 * @method static Builder|Invoice whereId($value)
 * @method static Builder|Invoice whereInvoiceContactId($value)
 * @method static Builder|Invoice whereInvoiceNumber($value)
 * @method static Builder|Invoice whereIsDraft($value)
 * @method static Builder|Invoice whereIssuedOn($value)
 * @method static Builder|Invoice whereLegacyId($value)
 * @method static Builder|Invoice whereNumberRangeDocumentNumbersId($value)
 * @method static Builder|Invoice wherePaymentDeadlineId($value)
 * @method static Builder|Invoice whereProjectId($value)
 * @method static Builder|Invoice whereSentAt($value)
 * @method static Builder|Invoice whereServicePeriodBegin($value)
 * @method static Builder|Invoice whereServicePeriodEnd($value)
 * @method static Builder|Invoice whereServiceProvision($value)
 * @method static Builder|Invoice whereTypeId($value)
 * @method static Builder|Invoice whereUpdatedAt($value)
 * @method static Builder|Invoice whereVatId($value)
 * @method static Builder|Invoice withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static Builder|Invoice withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static Builder|Invoice withMediaAndVariantsMatchAll($tags = [])
 * @method static Builder|Invoice withMediaMatchAll(bool $tags = [], bool $withVariants = false)
 *
 * @property-read float $lines_sum_gross
 * @property-read InvoiceType|null $type
 * @property-read float $amount_gross
 * @property-read float $amount_net
 * @property-read float $amount_tax
 * @property-read float $amount_paid
 * @property-read float $amount_open
 * @property-read array $invoice_address
 * @property-read Contact|null $invoice_contact
 *
 * @method static Builder<static>|Invoice byYear(int $year)
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
        'is_loss_of_receivables',
        'service_period_begin',
        'tax_id',
        'service_period_end',
        'sent_at',
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
     * @throws MpdfException|PathAlreadyExists
     */
    public static function createOrGetPdf(Invoice $invoice, bool $uploadToS3 = false): string
    {
        $invoice = Invoice::query()
            ->with('contact')
            ->with('project')
            ->with('project.manager')
            ->with('contact.tax')
            ->with('payment_deadline')
            ->with('type')
            ->with('lines', 'lines.rate')
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->where('id', $invoice->id)
            ->first();

        $taxes = $invoice->taxBreakdown($invoice->lines);
        $invoice->linked_invoices = $invoice->lines->filter(function ($line) {
            return $line->type_id === 9;
        });

        $invoice->lines = $invoice->lines->filter(function ($line) {
            return $line->type_id !== 9;
        });

        $bank_account = (object) [
            'iban' => 'DE39440100460126083465',
            'bic' => 'PBNKDEFF',
            'account_owner' => 'twiceware solutions e. K.',
            'bank_name' => 'Postbank',
        ];

        $pdfConfig = [];
        $pdfConfig['pdfA'] = !$invoice->is_draft;
        $pdfConfig['hide'] = true;
        $pdfConfig['watermark'] = $invoice->is_draft ? 'ENTWURF' : '';

        $pdfFile = PdfService::createPdf('invoice', 'pdf.invoice.index',
            ['invoice' => $invoice, 'taxes' => $taxes, 'bank_account' => $bank_account], $pdfConfig);

        return $pdfFile;
    }

    public function taxBreakdown(Collection $invoiceLines): array
    {
        $groupedEntries = [];
        foreach ($invoiceLines->groupBy('tax_rate_id') as $key => $value) {
            $groupedEntries[$key]['sum'] = $value->sum('tax');
            $groupedEntries[$key]['amount'] = $value->sum('amount');
            $groupedEntries[$key]['tax_rate'] = $value->first()->toArray()['rate'];
            // $sum = $sum + $groupedEntries[$key]['sum'];
        }

        return $groupedEntries;
    }

    public function scopeByYear(Builder $query, int|string $year): Builder
    {
        if ($year !== 'all') {
            return $query->whereYear('issued_on', $year);
        }

        return $query;
    }

    public function setDueDate(): void
    {
        $paymentDeadline = PaymentDeadline::query()->where('id', $this->payment_deadline_id)->first();
        if ($paymentDeadline->exists()) {
            $this->due_on = $this->issued_on->addDays($paymentDeadline->days);
        }
    }

    /**
     * @throws MpdfException
     * @throws PathAlreadyExists
     */
    public function release(): void
    {
        if (!$this->invoice_number) {
            $counter = Invoice::whereYear('issued_on', $this->issued_on->year)->max('invoice_number');
            if ($counter == 0) {
                $counter = $this->issued_on->year * 100000;
            }

            $counter++;

            $this->invoice_number = $counter;
        }

        $this->is_draft = false;

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

    /*

    public static function createBooking($invoice): BookkeepingBooking
    {

        $booking = BookkeepingBooking::whereMorphedTo('bookable', Invoice::class)->where('bookable_id',
            $invoice->id)->first();

        $invoice->load('lines');
        $invoice->amount = $invoice->lines->sum('amount') + $invoice->lines->sum('tax');

        $accounts = Contact::getAccounts($invoice->contact_id, true, true);
        $booking = BookkeepingBooking::createBooking($invoice, 'issued_on', 'amount', $accounts['subledgerAccount'],
            $accounts['outturnAccount'], 'A', $booking ? $booking->id : null);

        if ($booking) {
            $name = strtoupper($accounts['name']);
            $booking->booking_text = "Rechnungsausgang|$name|$invoice->formatedInvoiceNumber";
            $booking->save();
        }

        return $booking;
    }
    */

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

    public function getQrCodeAttribute(): string
    {
        if (!$this->contact) {
            return '';
        }

        $purposeText = [];
        $purposeText[] = 'RG-'.$this->formated_invoice_number;
        $purposeText[] = 'K-'.number_format($this->contact->debtor_number, 0, ',', '.');

        $bank_account = (object) [
            'iban' => 'DE39440100460126083465',
            'bic' => 'PBNKDEFF',
            'account_owner' => 'twiceware solutions e. K.',
            'bank_name' => 'Postbank',
        ];

        $payment = new QrPayment($bank_account->iban);
        $payment
            ->setBic($bank_account->bic)
            ->setBeneficiaryName($bank_account->account_owner)
            ->setAmount($this->amount_gross)
            ->setCurrency('EUR')
            ->setRemittanceText(implode(' ', $purposeText));

        return $payment->getQrCode()->getDataUri();
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

    public function payment_deadline(): HasOne
    {
        return $this->hasOne(PaymentDeadline::class, 'id', 'payment_deadline_id');
    }

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
            'due_on' => 'date',
            'sent_at' => 'datetime',
            'service_period_begin' => 'date',
            'service_period_end' => 'date',
            'is_loss_of_receivables' => 'boolean',
            'is_draft' => 'boolean',
        ];
    }
}
