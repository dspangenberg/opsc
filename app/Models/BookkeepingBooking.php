<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property-read BookkeepingAccount|null $account_credit
 * @property-read BookkeepingAccount|null $account_debit
 * @property-read Model|Eloquent $bookable
 * @property-read string $document_number
 * @property-read NumberRangeDocumentNumber|null $range_document_number
 * @property-read Tax|null $tax
 * @method static Builder<static>|BookkeepingBooking newModelQuery()
 * @method static Builder<static>|BookkeepingBooking newQuery()
 * @method static Builder<static>|BookkeepingBooking query()
 * @mixin Eloquent
 */
class BookkeepingBooking extends Model
{
    protected $fillable = [
        'account_id_credit',
        'account_id_debit',
        'amount',
        'date',
        'tax_id',
        'is_split',
        'split_id',
        'booking_text',
        'document_number_prefix',
        'document_number_year',
        'document_number',
        'is_split',
        'split_id',
        'note',
        'tax_credit',
        'tax_debit',
        'is_locked',
        'is_marked',
        'bookable_type',
        'bookable_id',
    ];

    protected $appends = [
        'document_number',
    ];

    public function scopeSearch($query, $search): Builder
    {
        $search = trim($search);
        if ($search) {
            $query
                ->where('booking_text', 'like', "%$search%");
        }
        return $query;
    }

    public static function createBooking(
        $parent,
        $dateField,
        $amountField,
        $debit_account,
        $credit_account,
        $documentNumberPrefix = '',
        $bookingId = null
    ): ?BookkeepingBooking {
        if (!$debit_account || !$credit_account) {
            BookkeepingLog::create([
                'parent_model' => $parent::class,
                'parent_id' => $parent->id,
                'text' => !$debit_account ? 'Sollkonto nicht gefunden' : 'Habenkonto nicht gefunden',
            ]);

            return null;
        };

        if ($bookingId) {
            $booking = BookkeepingBooking::find($bookingId);
            if ($booking->is_locked) {
                return null;
            }
        } else {
            $booking = new BookkeepingBooking;
            $booking->bookable()->associate($parent);
            $booking->date = $parent[$dateField];
        }

        if (!$booking->number_range_document_numbers_id) {
            $booking->number_range_document_numbers_id = $parent->number_range_document_numbers_id;
        }

        $amount = $parent[$amountField];
        $booking->amount = $amount < 0 ? $amount * -1 : $amount;

        if ($parent->amount < 0) {
            $booking->account_id_credit = $debit_account->account_number;
            $booking->account_id_debit = $credit_account->account_number;
        } else {
            $booking->account_id_debit = $debit_account->account_number;
            $booking->account_id_credit = $credit_account->account_number;
        }

        $taxes = BookkeepingAccount::getTax($booking->account_id_credit, $booking->account_id_debit, $booking->amount);
        $booking->tax_credit = $taxes['tax_credit'];
        $booking->tax_debit = $taxes['tax_debit'];
        $booking->tax_id = $taxes['tax_id'];
        $booking->booking_text = '';

        return $booking;
    }

    public function bookable(): MorphTo
    {
        return $this->morphTo();
    }

    public function account_credit(): HasOne
    {
        return $this->hasOne(BookkeepingAccount::class, 'account_number', 'account_id_credit');
    }

    public function account_debit(): HasOne
    {
        return $this->hasOne(BookkeepingAccount::class, 'account_number', 'account_id_debit');
    }

    public function tax(): HasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }

    public function getDocumentNumberAttribute(): string
    {
        if ($this->range_document_number) {
            return $this->range_document_number->document_number;
        }

        return $this->bookable ? $this->bookable->document_number : '';
    }

    public function range_document_number(): HasOne
    {
        return $this->hasOne(NumberRangeDocumentNumber::class, 'id', 'number_range_document_numbers_id');
    }

    protected function casts(): array
    {
        return [
            'date' => 'date',
        ];
    }
}
