<?php

namespace App\Models;

use App\Facades\WeasyPdfService;
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

/**
 * @property bool $is_draft
 * @property int|null $offer_number
 * @property-read Collection<int, Attachment> $attachments
 * @property-read int|null $attachments_count
 * @property-read BookkeepingBooking|null $booking
 * @property-read Contact|null $contact
 * @property-read float $amount_gross
 * @property-read float $amount_net
 * @property-read float $amount_open
 * @property-read float $amount_paid
 * @property-read float $amount_tax
 * @property-read string $filename
 * @property-read string $formated_offer_number
 * @property-read array $invoice_address
 * @property-read Collection<int, OfferLine> $lines
 * @property-read int|null $lines_count
 * @property-read Collection<int, Media> $media
 * @property-read int|null $media_count
 * @property-read Project|null $project
 * @property-read Tax|null $tax
 * @method static MediableCollection<int, static> all($columns = ['*'])
 * @method static Builder<static>|Offer byYear(int $year)
 * @method static MediableCollection<int, static> get($columns = ['*'])
 * @method static Builder<static>|Offer newModelQuery()
 * @method static Builder<static>|Offer newQuery()
 * @method static Builder<static>|Offer query()
 * @method static Builder<static>|Offer view($view)
 * @method static Builder<static>|Offer whereHasMedia($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Offer whereHasMediaMatchAll($tags)
 * @method static Builder<static>|Offer withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static Builder<static>|Offer withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Offer withMediaAndVariantsMatchAll($tags = [])
 * @method static Builder<static>|Offer withMediaMatchAll(array|string  $tags = [], bool $withVariants = false)
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
     * @throws Exception
     */
    public static function createOrGetPdf(Offer $offer, bool $uploadToS3 = false): string
    {
        $offer = Offer::query()
            ->with('contact')
            ->with('project')
            ->with('project.manager')
            ->with('contact.tax')
            ->with([
                'sections' => function ($query) {
                    $query->orderBy('pos');
                },
            ])
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


        $pdfConfig = [];
        $pdfConfig['pdfA'] = ! $offer->is_draft;
        $pdfConfig['hide'] = true;
        $pdfConfig['watermark'] = $offer->is_draft ? 'ENTWURF' : '';

        $attachments = $offer->attachments()->with('document')->get()->map(function ($attachment) {
            return $attachment->document_id;
        });

        return WeasyPdfService::createPdf('offer', 'pdf.offer.index',
            [
                'offer' => $offer,
                'taxes' => $taxes,
                'attachments' => $offer->attachments()->orderBy('pos')->with('document')->get()
            ], $pdfConfig, $attachments->toArray());
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

    public function release(): void
    {
        if (! $this->offer_number) {

            $counter = Offer::whereYear('issued_on', $this->issued_on->year)
                ->whereMonth('issued_on', $this->issued_on->month)
                ->max('offer_number');

            if ($counter == 0) {
                $counter = ($this->issued_on->year * 100000) + ($this->issued_on->month * 1000);
            }

            $counter++;

            $this->offer_number = $counter;
            $this->valid_until = $this->issued_on->copy()->addDays(30);
        }

        $this->is_draft = false;

        $this->save();
    }

    /**
     * Update offer positions with validated line data
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

    public function attachments(): MorphMany
    {
        return $this->morphMany(Attachment::class, 'attachable')->orderBy('pos');
    }

    public function sections(): HasMany
    {
        return $this->hasMany(OfferOfferSection::class);
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
