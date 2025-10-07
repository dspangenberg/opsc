<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;
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
 * @mixin Eloquent
 */
class Receipt extends Model
{
    use Mediable;

    protected $appends = [
        'document_number',
        'open_amount'
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
        'bookkeeping_account_id',
        'cost_center_id',
        'org_currency',
        'org_amount',
        'amount',
        'is_confirmed',
        'iban',
        'checksum',
        'text',
        'data',
        'file_created_at',
        'duplicate_of'
    ];

    public function getDocumentNumberAttribute(): string
    {
        return $this->number_range_document_numbers_id ? $this->range_document_number->document_number : '';
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function getOpenAmountAttribute(): string
    {
        return ($this->amount + $this->payable_sum_amount );
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
    public function booking(): MorphOne
    {
        return $this->morphOne(BookkeepingBooking::class, 'bookable');
    }
    
    public static function createBooking($receipt): void
    {
        $accounts = Contact::getAccounts(false, $receipt->contact_id);

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
