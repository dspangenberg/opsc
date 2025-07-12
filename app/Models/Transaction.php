<?php

namespace App\Models;

use App\Observers\TransactionObserver;
use Eloquent;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphOne;
use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

#[ObservedBy([TransactionObserver::class])]
/**
 * 
 *
 * @property int $id
 * @property string $mm_ref
 * @property int $contact_id
 * @property int $bank_account_id
 * @property Carbon $valued_on
 * @property Carbon|null $booked_on
 * @property string|null $comment
 * @property string $currency
 * @property string|null $booking_key
 * @property string|null $bank_code
 * @property string|null $account_number
 * @property string $name
 * @property string|null $purpose
 * @property float $amount
 * @property float $amount_EUR
 * @property int $is_private
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property string $prefix
 * @property int|null $document_number
 * @property int $year
 * @property-read BankAccount|null $bank_account
 * @property-read string $real_document_number
 * @method static Builder|Transaction newModelQuery()
 * @method static Builder|Transaction newQuery()
 * @method static Builder|Transaction query()
 * @method static Builder|Transaction whereAccountNumber($value)
 * @method static Builder|Transaction whereAmount($value)
 * @method static Builder|Transaction whereAmountEUR($value)
 * @method static Builder|Transaction whereBankAccountId($value)
 * @method static Builder|Transaction whereBankCode($value)
 * @method static Builder|Transaction whereBookedOn($value)
 * @method static Builder|Transaction whereBookingKey($value)
 * @method static Builder|Transaction whereComment($value)
 * @method static Builder|Transaction whereContactId($value)
 * @method static Builder|Transaction whereCreatedAt($value)
 * @method static Builder|Transaction whereCurrency($value)
 * @method static Builder|Transaction whereDocumentNumber($value)
 * @method static Builder|Transaction whereId($value)
 * @method static Builder|Transaction whereIsPrivate($value)
 * @method static Builder|Transaction whereMmRef($value)
 * @method static Builder|Transaction whereName($value)
 * @method static Builder|Transaction wherePrefix($value)
 * @method static Builder|Transaction wherePurpose($value)
 * @method static Builder|Transaction whereUpdatedAt($value)
 * @method static Builder|Transaction whereValuedOn($value)
 * @method static Builder|Transaction whereYear($value)
 * @property string|null $booking_text
 * @property string|null $type
 * @property string|null $return_reason
 * @property string|null $transaction_code
 * @property string|null $end_to_end_reference
 * @property string|null $mandate_reference
 * @property string|null $batch_reference
 * @property string|null $primanota_number
 * @method static Builder|Transaction whereBatchReference($value)
 * @method static Builder|Transaction whereBookingText($value)
 * @method static Builder|Transaction whereEndToEndReference($value)
 * @method static Builder|Transaction whereMandateReference($value)
 * @method static Builder|Transaction wherePrimanotaNumber($value)
 * @method static Builder|Transaction whereReturnReason($value)
 * @method static Builder|Transaction whereTransactionCode($value)
 * @method static Builder|Transaction whereType($value)
 * @property-read Contact|null $contact
 * @property int $is_transit
 * @property int|null $booking_id
 * @method static Builder|Transaction whereBookingId($value)
 * @method static Builder|Transaction whereIsTransit($value)
 * @property string|null $org_category
 * @property-read string $bookkeeping_text
 * @method static Builder|Transaction whereOrgCategory($value)
 * @property float $amount_in_foreign_currency
 * @method static Builder|Transaction whereAmountInForeignCurrency($value)
 * @property int $number_range_document_numbers_id
 * @method static Builder|Transaction whereNumberRangeDocumentNumbersId($value)
 * @property string|null $foreign_currency
 * @method static Builder|Transaction whereForeignCurrency($value)
 * @method static Builder|Transaction rulesAnd(Collection $conditions)
 * @property-read BookkeepingBooking|null $booking
 * @property-read \Illuminate\Database\Eloquent\Collection<int, Payment> $payments
 * @property-read int|null $payments_count
 * @property-read NumberRangeDocumentNumber|null $range_document_number
 * @property int $counter_account_id
 * @property int $is_locked
 * @method static Builder|Transaction whereCounterAccountId($value)
 * @method static Builder|Transaction whereIsLocked($value)
 * @mixin Eloquent
 */
class Transaction extends Model
{
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

    public static function createBooking(Transaction $transaction, $dryRun = false): array
    {

        $transaction->load('bank_account');
        $booking = BookkeepingBooking::whereMorphedTo('bookable', Transaction::class)->where('bookable_id', $transaction->id)->limit(5)->first();

        $accounts = [
            'creditId' => '',
            'debitId' => '',
        ];

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

        $accountDebit = BookkeepingAccount::where('account_number', $accounts['debitId'])->first();
        $accountCredit = BookkeepingAccount::where('account_number', $accounts['creditId'])->first();

        if (! $accounts['creditId']) {
            $accounts = Contact::getAccounts($transaction->contact_id);

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

    public function getContact(): void
    {
        if ($this->account_number || $this->name || $this->purpose) {
            $contact = Contact::where('iban', $this->account_number)
                ->orWhere('paypal_email', $this->account_number)
                ->orWhere('cc_name', $this->name)
                ->orWhere('cc_name', $this->purpose)
                ->first();

            if ($contact) {
                $this->contact_id = $contact->id;
            }
        }

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
            if ($this->is_transit) {
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

        if ($this->booking_text) {
            $private = $this->is_private ? ' (privat)' : '';
            $lines[] = $this->booking_text.$private;
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

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class, 'transaction_id', 'id');
    }

    protected function casts(): array
    {
        return [
            'valued_on' => 'date',
            'booked_on' => 'date',
        ];
    }
}
