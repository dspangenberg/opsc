<?php

namespace App\Models;

use App\Services\PdfService;
use App\Services\WeasyPdfService;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Mpdf\MpdfException;
use Plank\Mediable\Media;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableCollection;
use Plank\Mediable\MediableInterface;
use Spatie\Holidays\Countries\Germany;
use Spatie\Holidays\Holidays;
use Spatie\TemporaryDirectory\Exceptions\PathAlreadyExists;

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
 * @mixin Eloquent
 */
class Offer extends Model implements MediableInterface
{
    use Mediable;

    protected $fillable = [
        'contact_id',
        'project_id',
        'offer_number',
        'issued_on',
        'is_draft',
        'address',
        'tax_id',
        'sent_at',
    ];

    protected $attributes = [
        'project_id' => 0,
    ];

    protected $appends = [
        'formated_offer_number',
        'invoice_address',
        'amount_net',
        'amount_tax',
        'amount_gross',
        'amount_open',
    ];

    /**
     * @throws MpdfException|PathAlreadyExists
     */
    public static function createOrGetPdf(Offer $offer, bool $uploadToS3 = false): string
    {
        $offer = Offer::query()
            ->with('contact')
            ->with('project')
            ->with('project.manager')
            ->with('contact.tax')
            ->with([
                'lines' => function ($query) {
                    $query->with('rate')->orderBy('pos');
                },
            ])
            ->withSum('lines', 'amount')
            ->withSum('lines', 'tax')
            ->where('id', $offer->id)
            ->first();

        $taxes = $offer->taxBreakdown($offer->lines);

        $offer->lines = $offer->lines->filter(function ($line) {
            return $line->type_id !== 9;
        });

        $pdfConfig = [];
        $pdfConfig['pdfA'] = ! $offer->is_draft;
        $pdfConfig['hide'] = true;
        $pdfConfig['watermark'] = $offer->is_draft ? 'ENTWURF' : '';

        $pdfFile = PdfService::createPdf('offer', 'pdf.offer.index',
            [
                'offer' => $offer,
                'taxes' => $taxes
            ], $pdfConfig, [82]);

        return $pdfFile;
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

    /**
     * @throws MpdfException
     * @throws PathAlreadyExists
     */
    public function release(): void
    {
        if (! $this->invoice_number) {
            $counter = Offer::whereYear('issued_on', $this->issued_on->year)->max('invoice_number');
            if ($counter == 0) {
                $counter = $this->issued_on->year * 100000;
            }

            $counter++;

            $this->invoice_number = $counter;
        }

        $this->setDueDate();
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

            $lineAttributes = [
                'offer_id' => $this->id,
                'quantity' => $line['quantity'],
                'type_id' => $line['type_id'] ?: 1,
                'unit' => $line['unit'] ?? '',
                'tax_rate_id' => $line['tax_rate_id'] ?? null,
                'text' => $line['text'] ?? '',
                'price' => $line['price'] ?? 0,
                'amount' => $amount,
                'tax_rate' => $taxRate->rate ?? 0,
                'tax' => $amount / 100 * $taxRate->rate,
                'pos' => $line['type_id'] === 9 ? 999 : $line['pos'] ?? $index,
            ];

            if ($line['id'] > 0) {
                OfferLine::where('id', $line['id'])
                    ->where('offer_id', $this->id)
                    ->update($lineAttributes);
            } else {
                OfferLine::create($lineAttributes);
            }
        }
    }



    public function getFormatedOfferNumberAttribute(): string
    {
        if ($this->offer_number) {
            return formated_offer_id($this->offer_number);
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
        return 'AG-'.str_replace('.', '_', basename($this->formated_offer_number)).'.pdf';
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


    public function lines(): HasMany
    {
        return $this->hasMany(OfferLine::class);
    }

    public function contact(): HasOne
    {
        return $this->hasOne(Contact::class, 'id', 'contact_id');
    }

    public function tax(): HasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }

    public function project(): HasOne
    {
        return $this->hasOne(Project::class, 'id', 'project_id');
    }

    public function scopeView(Builder $query, $view): Builder
    {
        return match ($view) {
            'drafts' => $query->where('is_draft', true),
            default => $query->where('is_draft', false)
        };
    }

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
            'valid_until' => 'date',
            'sent_at' => 'datetime',
            'is_draft' => 'boolean',
        ];
    }
}
