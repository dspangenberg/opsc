<?php

namespace App\Models;

use App\Observers\TransactionObserver;
use App\Traits\HasDynamicFilters;
use Eloquent;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;

#[ObservedBy([TransactionObserver::class])]
/**
 * @property-read BankAccount|null $bank_account
 * @property-read BookkeepingBooking|null $booking
 * @property-read Contact|null $contact
 * @property-read string $bookkeeping_text
 * @property-read string $document_number
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Payment> $payments
 * @property-read int|null $payments_count
 * @property-read NumberRangeDocumentNumber|null $range_document_number
 *
 * @method static Builder<static>|Transaction newModelQuery()
 * @method static Builder<static>|Transaction newQuery()
 * @method static Builder<static>|Transaction query()
 *
 * @property-read BookkeepingAccount|null $account
 * @property-read float $remaining_amount
 *
 * @method static Builder<static>|Transaction applyDynamicFilters(\Illuminate\Http\Request $request, array $options = [])
 * @method static Builder<static>|Transaction applyFiltersFromObject(array|string $filters, array $options = [])
 * @method static Builder<static>|Transaction search($searchText)
 * @method static Builder<static>|Transaction hidePrivate()
 *
 * @mixin Eloquent
 */
class Transaction extends Model
{
    use HasDynamicFilters;

    protected $fillable = [
        'mm_ref',
        'contact_id',
        'bank_account_id',
        'valued_on',
        'booked_on',
        'comment',
        'currency',
        'booking_key',
        'bank_code',
        'account_number',
        'name',
        'purpose',
        'amount',
        'is_private',
        'is_transit',
        'booking_text',
        'type',
        'return_reason',
        'transaction_code',
        'end_to_end_reference',
        'mandate_reference',
        'batch_reference',
        'primanota_number',
        'amount_in_foreign_currency',
        'foreign_currency',
        'org_category',
        'counter_account_id',
    ];

    protected $appends = [
        'bookkeeping_text',
        'document_number',
    ];

    protected $attributes = [
        'mm_ref' => null,
        'contact_id' => 0,
        'bank_account_id' => 0,
        'valued_on' => null,
        'booking_text' => '',
    ];

    public function scopeSearch(Builder $query, $searchText): Builder
    {
        if ($searchText) {
            $searchText = '%'.$searchText.'%';

            return $query
                ->whereLike('name', $searchText)
                ->orWhereLike('purpose', $searchText)
                ->orWhereLike('account_number', $searchText);
        }

        return $query;
    }

    public function scopeHidePrivate(Builder $query): Builder
    {
        return $query->whereNotIn('counter_account_id', [1890, 1800]);
    }

    public function scopeIssuedBetween(Builder $query, $from, $to): Builder
    {
        return $query->whereBetween('booked_on', [$from, $to]);
    }

    public function scopeHideTransit(Builder $query): Builder
    {
        return $query->whereNotIn('counter_account_id', [1360]);
    }

    protected function getFilterLabel(string $key, mixed $value): ?string
    {
        return match ($key) {
            'issuedBetween' => is_array($value) && count($value) >= 2
                ? 'Zeitraum: '.\Illuminate\Support\Carbon::parse($value[0])->format('d.m.Y').' - '.\Illuminate\Support\Carbon::parse($value[1])->format('d.m.Y')
                : null,
            'counter_account_id' => (int) $value === 0 ? 'ohne Gegenkonto' : 'Konto: '.$value,
            'is_locked' => 'nur unbestätigt',
            'hide_private' => 'private Transaktionen ausblenden',
            'hide_transit' => 'Geldtransit ausblenden',
            default => null,
        };
    }

    public static function createBooking(Transaction $transaction, $dryRun = false): array
    {

        $transaction->load('bank_account');

        if (! $transaction->number_range_document_numbers_id) {
            $transaction->number_range_document_numbers_id = NumberRange::createDocumentNumber($transaction,
                'booked_on', $transaction->bank_account->prefix);
            $transaction->save();
        }

        $booking = BookkeepingBooking::whereMorphedTo('bookable', Transaction::class)->where('bookable_id', $transaction->id)->limit(5)->first();

        $accounts = [
            'creditId' => '',
            'debitId' => '',
        ];

        $accounts['creditId'] = $transaction->counter_account_id;
        $accounts['debitId'] = $transaction->bank_account->bookkeeping_account_id;

        /*
        if ($transaction->is_private) {
            $accounts['creditId'] = $transaction->amount < 0 ? 1800 : 1890;
            $accounts['debitId'] = $transaction->bank_account->bookkeeping_account_id;
        }

        if ($transaction->is_transit) {
            $accounts['creditId'] = 1360;
            if ($transaction->bank_account) {
                $accounts['debitId'] = $transaction->bank_account->bookkeeping_account_id;
            } else {
                if (str_starts_with('HOL', $transaction->document_number)) {
                    $accounts['debitId'] = 1250;
                }

                if (str_starts_with('PP', $transaction->document_number)) {
                    $accounts['debitId'] = 1297;
                }
            }
        }
      */

        $accountDebit = BookkeepingAccount::where('account_number', $accounts['debitId'])->first();
        $accountCredit = BookkeepingAccount::where('account_number', $accounts['creditId'])->first();

        if (! $accounts['creditId']) {
            $accounts = Contact::getAccounts(false, $transaction->contact_id);

            if ($accounts['subledgerAccount']) {
                $accountCredit = $accounts['subledgerAccount'];
            } else {
                if ($accounts['outturnAccount']) {
                    $accountCredit = $accounts['outturnAccount'];
                }
            }

            if ($transaction->counter_account_id) {
                $accountCredit = BookkeepingAccount::where('account_number', $transaction->counter_account_id)->first();
            }

            if ($transaction->bank_account) {
                $accountDebit = BookkeepingAccount::where('account_number', $transaction->bank_account->bookkeeping_account_id)->first();
            }
        }

        if ($accountDebit && $accountCredit) {

            $booking = BookkeepingBooking::createBooking($transaction, 'booked_on', 'amount', $accountDebit,
                $accountCredit, $transaction->bank_account->prefix,
                $booking ? $booking->id : null
            );

            $booking->booking_text = $transaction->bookkeeping_text ?: '';

            if ($dryRun) {
                dump($booking->toArray());
            } else {
                $booking->save();

            }

            return $booking->toArray();
        }

        return [];
    }

    public function getContact(): bool
    {
        if ($this->account_number || $this->name || $this->purpose) {
            if ($this->account_number || $this->name) {
                $contact = Contact::query()
                    ->when($this->account_number, function ($query) {
                        $query
                            ->where('iban', $this->account_number)
                            ->orWhere('paypal_email', $this->account_number);
                    })
                    ->when($this->name, function ($query) {
                        $query->orWhere('cc_name', $this->name);
                    })
                    ->first();
                if ($contact) {
                    if ($contact->creditor_number) {
                        $this->counter_account_id = $contact->creditor_number;
                    }

                    if ($contact->debtor_number) {
                        $this->counter_account_id = $contact->debtor_number;
                    }

                    $this->contact_id = $contact->id;
                    $this->save();

                    return true;
                }
            }
        }

        return false;
    }

    public function contact(): BelongsTo
    {
        return $this->belongsTo(Contact::class);
    }

    public function booking(): MorphOne
    {
        return $this->morphOne(BookkeepingBooking::class, 'bookable');
    }

    public function getDocumentNumberAttribute(): string
    {
        return $this->range_document_number ? $this->range_document_number->document_number : '';
    }

    public function range_document_number(): HasOne
    {
        return $this->hasOne(NumberRangeDocumentNumber::class, 'id', 'number_range_document_numbers_id');
    }

    public function getBookkeepingTextAttribute(): string
    {
        $lines = [];

        if (! $this->booking_text && $this->booking_key === 'MSC') {
            if ($this->counter_account_id !== 1360) {
                $this->booking_text = $this->amount < 0 ? 'Überweisung' : 'Gutschrift';
            } else {
                if ($this->booking_text === 'Bank transfer') {
                    $this->booking_text = ($this->amount >= 0) ? 'Gutschrift' : 'Lastschrift';
                } else {
                    if ($this->account_number === '') {
                        $this->booking_text = 'Kreditkartenzahlung';
                    }
                }
            }
        }

        if ($this->counter_account_id === 1800 || $this->counter_account_id === 1890) {
            $lines[] = $this->booking_text.' (privat)';
        } else {
            $lines[] = $this->booking_text;
        }

        $lines[] = $this->name;

        if ($this->name !== $this->purpose) {
            $lines[] = $this->purpose;
        }

        return implode('|', array_filter($lines));
    }

    public function bank_account(): BelongsTo
    {
        return $this->belongsTo(BankAccount::class);
    }

    public function account(): BelongsTo
    {
        return $this->belongsTo(BookkeepingAccount::class, 'counter_account_id', 'account_number');
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'transaction_id', 'id');
    }

    public function getRemainingAmountAttribute(): float
    {
        $totalPayments = $this->payments()->sum('amount');

        return round($this->amount - $totalPayments, 2);
    }

    protected function casts(): array
    {
        return [
            'valued_on' => 'date',
            'booked_on' => 'date',
        ];
    }
}
