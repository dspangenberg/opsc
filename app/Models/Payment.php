<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $payable_type
 * @property int $payable_id
 * @property int $booking_id
 * @property int $transaction_id
 * @property float $amount
 * @property int $is_private
 * @property Carbon $issued_on
 * @property int $is_confirmed
 * @property int $rank
 * @property Carbon|null $deleted_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|Payment newModelQuery()
 * @method static Builder|Payment newQuery()
 * @method static Builder|Payment onlyTrashed()
 * @method static Builder|Payment query()
 * @method static Builder|Payment whereAmount($value)
 * @method static Builder|Payment whereBookingId($value)
 * @method static Builder|Payment whereCreatedAt($value)
 * @method static Builder|Payment whereDeletedAt($value)
 * @method static Builder|Payment whereId($value)
 * @method static Builder|Payment whereIsConfirmed($value)
 * @method static Builder|Payment whereIsPrivate($value)
 * @method static Builder|Payment whereIssuedOn($value)
 * @method static Builder|Payment wherePayableId($value)
 * @method static Builder|Payment wherePayableType($value)
 * @method static Builder|Payment whereRank($value)
 * @method static Builder|Payment whereTransactionId($value)
 * @method static Builder|Payment whereUpdatedAt($value)
 * @method static Builder|Payment withTrashed()
 * @method static Builder|Payment withoutTrashed()
 *
 * @property-read Model|\Eloquent $payable
 * @property-read \App\Models\Transaction|null $transaction
 * @property int $is_currency_difference
 *
 * @method static Builder|Payment whereIsCurrencyDifference($value)
 *
 * @property int $is_ignored
 *
 * @method static Builder|Payment whereIsIgnored($value)
 *
 * @mixin Eloquent
 */
class Payment extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'payable_type',
        'payable_id',
        'booking_id',
        'transaction_id',
        'amount',
        'issued_on',
        'is_confirmed',
        'is_private',
        'rank',
    ];

    public static function createBookingIncoming($payment): void
    {

        $invoice = Invoice::where('id', $payment->payable_id)
            ->withSum('lines', 'amount')
            ->withSum('payments', 'amount')
            ->withSum('lines', 'tax')
            ->with('contact')
            ->first();

        if ($invoice) {
            $debtorAccount = BookkeepingAccount::where('account_number', $invoice->contact->debtor_number)->first();
            $bankAccount = BookkeepingAccount::where('account_number', $payment->transaction->bank_account->bookkeeping_account_id)->first();

            $booking = BookkeepingBooking::createBooking($payment, 'issued_on', 'amount', $bankAccount, $debtorAccount, $payment->transaction->bank_account->prefix);
            $contactText = $invoice->contact->short_name ? $invoice->contact->short_name : $invoice->contact->full_name;
            $booking->booking_text = $contactText.'|Zahlungseingang ('.$invoice->formated_invoice_number.')|'.$payment->transaction->bookkepping_text;
            $booking->save();
        }
    }

    public function payable(): MorphTo
    {
        return $this->morphTo();
    }

    public function transaction(): HasOne
    {
        return $this->hasOne(Transaction::class, 'id', 'transaction_id');
    }

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
        ];
    }
}
