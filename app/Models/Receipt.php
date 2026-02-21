<?php

namespace App\Models;

use App\Ai\Agents\ReceiptExtractor;
use App\Traits\HasDynamicFilters;
use Eloquent;
use Exception;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Log;
use Plank\Mediable\Media;
use Plank\Mediable\Mediable;
use Plank\Mediable\MediableCollection;

/**
 * @property-read BookkeepingAccount|null $account
 * @property-read Contact|null $contact
 * @property-read CostCenter|null $costCenter
 * @property-read string $document_number
 * @property-read Collection<int, Media> $media
 * @property-read int|null $media_count
 * @property-read NumberRangeDocumentNumber|null $numberRangeDocumentNumber
 *
 * @method static MediableCollection<int, static> all($columns = ['*'])
 * @method static MediableCollection<int, static> get($columns = ['*'])
 * @method static Builder<static>|Receipt newModelQuery()
 * @method static Builder<static>|Receipt newQuery()
 * @method static Builder<static>|Receipt query()
 * @method static Builder<static>|Receipt whereHasMedia($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Receipt whereHasMediaMatchAll($tags)
 * @method static Builder<static>|Receipt withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static Builder<static>|Receipt withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static Builder<static>|Receipt withMediaAndVariantsMatchAll($tags = [])
 * @method static Builder<static>|Receipt withMediaMatchAll(bool $tags = [], bool $withVariants = false)
 *
 * @property-read BookkeepingBooking|null $booking
 * @property-read CostCenter|null $cost_center
 * @property-read float $open_amount
 * @property-read Collection<int, Payment> $payable
 * @property-read int|null $payable_count
 * @property-read NumberRangeDocumentNumber|null $range_document_number
 *
 * @mixin Eloquent
 */
class Receipt extends Model
{
    use HasDynamicFilters;
    use Mediable;
    use SoftDeletes;

    protected $appends = [
        'document_number',
        'open_amount',
    ];

    protected $attributes = [
        'reference' => '',
        'contact_id' => null,
        'bookkeeping_account_id' => null,
        'cost_center_id' => null,
        'org_currency' => 'EUR',
        'org_amount' => 0,
        'amount' => 0,
        'is_confirmed' => false,
        'iban' => '',
        'number_range_document_numbers_id' => null,
        'checksum' => '',
        'text' => '',
        'data' => '[]',
    ];

    protected $fillable = [
        'reference',
        'contact_id',
        'issued_on',
        'bookkeeping_account_id',
        'cost_center_id',
        'org_currency',
        'cost_center_id',
        'org_amount',
        'amount',
        'is_confirmed',
        'iban',
        'checksum',
        'text',
        'data',
        'file_created_at',
        'duplicate_of',
    ];

    public function getDocumentNumberAttribute(): string
    {
        return $this->number_range_document_numbers_id ? $this->range_document_number->document_number : '';
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function getOpenAmountAttribute(): float
    {
        return $this->amount + $this->payable_sum;
    }

    public function getOriginalFilename(): string
    {
        $media = $this->firstMedia('file');

        return $media?->filename ?? $this->org_filename;
    }

    public function payableWithoutCurrencyDifference(): MorphMany
    {
        return $this->payable()->where('is_currency_difference', false);
    }

    public function cost_center(): BelongsTo
    {
        return $this->belongsTo(CostCenter::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(BookkeepingAccount::class);
    }

    public function range_document_number(): BelongsTo
    {
        return $this->belongsTo(NumberRangeDocumentNumber::class, 'number_range_document_numbers_id', 'id');
    }

    public function extractInvoiceData(): self
    {
        if ($this->text) {
            try {
                $agent = ReceiptExtractor::make();
                $context = json_encode([
                    'fulltext' => $this->text,
                    'creditors' => BookkeepingAccount::where('type', 'c')->get()->toArray(),
                    'costCenters' => CostCenter::all()->toArray(),
                ]);

                $result = $agent->prompt($context);
                $this->data = $result;
                $this->save();

                if (isset($result['reference'])) {
                    $this->reference = $result['reference'];
                }

                if (isset($result['costcenter'])) {
                    $costCenter = CostCenter::find($result['costcenter']);
                    if ($costCenter) {
                        $this->cost_center_id = $costCenter->id;
                    }
                }

                if (isset($result['issued_on'])) {
                    try {
                        $parsedDate = Carbon::parse($result['issued_on']);
                        if ($parsedDate) {
                            $this->issued_on = $parsedDate;
                        }
                    } catch (Exception $e) {
                        Log::warning('Invalid issued_on date from ReceiptExtractor', [
                            'receipt_id' => $this->id,
                            'invalid_date' => $result['issued_on'],
                            'error' => $e->getMessage(),
                        ]);
                    }
                }

                if (isset($result['currency'])) {
                    $this->org_currency = $result['currency'];
                }

                $validAmount = null;
                if (isset($result['amount']) && is_numeric($result['amount'])) {
                    $validAmount = (float) $result['amount'];
                }

                if ($this->org_currency !== 'EUR' && $validAmount !== null) {
                    $this->amount = $validAmount;
                    $this->org_amount = $validAmount;
                    $this->is_foreign_currency = true;

                    if ($this->issued_on instanceof Carbon) {
                        $conversion = ConversionRate::convertAmount($this->amount, $this->org_currency, $this->issued_on);
                        if ($conversion) {
                            $this->amount = $conversion['amount'];
                            $this->exchange_rate = $conversion['rate'];
                        }
                    }
                } elseif ($validAmount !== null) {
                    $this->amount = $validAmount;
                }

                if (isset($result['confidence']) && is_numeric($result['confidence'])) {
                    if ($result['confidence'] > 0.9) {
                        $this->is_confirmed = true;
                    }
                }

                if (isset($result['creditor_id'])) {
                    $contact = Contact::where('creditor_number', $result['creditor_id'])->first();
                    if ($contact) {
                        $this->contact_id = $contact->id;
                    }
                }

                $this->save();

                return $this;
            } catch (Exception $e) {
                Log::error('Receipt extraction failed', [
                    'receipt_id' => $this->id,
                    'error' => $e->getMessage(),
                    'stack_trace' => $e->getTraceAsString(),
                ]);

                // Don't rethrow to avoid losing PDF parsing work
                return $this;
            }
        }

        return $this;
    }

    protected function casts(): array
    {
        return [
            'file_created_at' => 'datetime',
            'issued_on' => 'date',
            'is_confirmed' => 'boolean',
            'data' => 'array',
        ];
    }

    public function payable(): MorphMany
    {
        return $this->morphMany(Payment::class, 'payable');
    }

    public function bookings(): MorphMany
    {
        return $this->morphMany(BookkeepingBooking::class, 'bookable');
    }

    public function scopeWithoutBookings(Builder $query): Builder
    {
        return $query->whereDoesntHave('bookings');
    }

    public function scopeSearch(Builder $query, $searchText): Builder
    {
        if ($searchText) {
            $orgSearchText = $searchText;
            $searchText = '%'.$searchText.'%';

            return $query->where(function (Builder $q) use ($searchText, $orgSearchText) {
                $q->whereLike('reference', $searchText)
                    ->orWhereRelation('contact', 'name', 'like', $searchText)
                    ->orWhereRelation('range_document_number', 'document_number', '=', $orgSearchText);
            });
        }

        return $query;
    }

    public function scopeIssuedBetween(Builder $query, $from, $to): Builder
    {
        return $query->whereBetween('issued_on', [$from, $to]);
    }

    public function scopeIsUnpaid(Builder $query): Builder
    {
        $sql = 'receipts.amount + COALESCE((SELECT SUM(amount) FROM payments WHERE payable_type = ? AND payable_id = receipts.id AND is_currency_difference = false), 0) != 0';

        return $query->whereRaw($sql, [self::class]);
    }

    protected function getFilterLabel(string $key, mixed $value): ?string
    {
        return match ($key) {
            'is_unpaid' => 'nur unbezahlte',
            'issuedBetween' => is_array($value) && count($value) >= 2
                ? 'Zeitraum: '.Carbon::parse($value[0])->format('d.m.Y').' - '.Carbon::parse($value[1])->format('d.m.Y')
                : null,
            'contact_id' => ($contact = Contact::find($value))
                ? 'Kreditor: '.($contact->reverse_full_name ?? $value)
                : 'Kreditor: '.$value,
            'cost_center_id' => ($costCenter = CostCenter::find($value))
                ? 'Kostenstelle: '.($costCenter->name ?? $value)
                : 'Kostenstelle: '.$value,
            'org_currency' => 'Währung: '.$value,
            default => null,
        };
    }

    public static function createBooking($receipt): void
    {
        $accounts = Contact::getAccounts(false, $receipt->contact_id);
        $receipt->load('cost_center');

        if (! $accounts['outturnAccount']) {
            if ($receipt->cost_center?->bookkeeping_account_id) {
                $accounts['outturnAccount'] = BookkeepingAccount::find($receipt->cost_center->bookkeeping_account_id);
            }
        }

        $booking = BookkeepingBooking::whereMorphedTo('bookable', Receipt::class)->where('bookable_id',
            $receipt->id)->first();
        $booking = BookkeepingBooking::createBooking(
            $receipt, 'issued_on',
            'amount',
            $accounts['outturnAccount'],
            $accounts['subledgerAccount'],
            'E',
            $booking ? $booking->id : null
        );
        $name = strtoupper($accounts['name']);
        $bookingTextSuffix = $receipt->org_currency !== 'EUR' ? '(originär '.number_format($receipt->org_amount, 2, ',',
            '.').' '.$receipt->org_currency.')' : '';

        $booking->booking_text = "Rechnungseingang|$name|$receipt->reference|$bookingTextSuffix";
        $booking->save();
    }
}
