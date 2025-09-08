<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read Model|Eloquent $payable
 * @property-read Transaction|null $transaction
 * @method static Builder<static>|Payment newModelQuery()
 * @method static Builder<static>|Payment newQuery()
 * @method static Builder<static>|Payment onlyTrashed()
 * @method static Builder<static>|Payment query()
 * @method static Builder<static>|Payment withTrashed(bool $withTrashed = true)
 * @method static Builder<static>|Payment withoutTrashed()
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
