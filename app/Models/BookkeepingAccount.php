<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Carbon;

/**
 * 
 *
 * @property int $id
 * @property int $account_number
 * @property string $name
 * @property string $type
 * @property int $is_default
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int $tax_id
 * @method static Builder|BookkeepingAccount newModelQuery()
 * @method static Builder|BookkeepingAccount newQuery()
 * @method static Builder|BookkeepingAccount query()
 * @method static Builder|BookkeepingAccount whereAccountNumber($value)
 * @method static Builder|BookkeepingAccount whereCreatedAt($value)
 * @method static Builder|BookkeepingAccount whereId($value)
 * @method static Builder|BookkeepingAccount whereIsDefault($value)
 * @method static Builder|BookkeepingAccount whereName($value)
 * @method static Builder|BookkeepingAccount whereTaxId($value)
 * @method static Builder|BookkeepingAccount whereType($value)
 * @method static Builder|BookkeepingAccount whereUpdatedAt($value)
 * @property-read string $label
 * @property-read \App\Models\Tax|null $tax
 * @mixin Eloquent
 */
class BookkeepingAccount extends Model
{
    protected $fillable = [
        'account_number',
        'name',
        'tax_id',
        'type',
    ];

    protected $appends = [
        'label',
    ];

    public static function getTax(int $accountIdCredit, int $accountIdDebit, float $amount): array
    {
        $account = BookkeepingAccount::query()->where('account_number', $accountIdCredit)->with('tax')->first();
        $debit = BookkeepingAccount::query()->where('account_number', $accountIdDebit)->with('tax')->first();

        $return = [
            'tax_id' => 0,
            'tax_credit' => 0,
            'tax_debit' => 0,
        ];

        if (! $account && ! $debit) {
            return $return;
        }

        $bookingKeepingAccount = $account?->tax_id ? $account : $debit;

        $tax = Tax::find($bookingKeepingAccount->tax_id);

        if ($tax && $tax->value > 0) {
            $return['tax_id'] = $tax->id;
            $taxAmount = round($amount / ($tax->value + 100) * $tax->value, 2);

            // round(($receipt->gross / ($receipt->tax_rate + 100) * $receipt->tax_rate), 2);

            if ($tax->is_bidirectional) {
                $return['tax_credit'] = $taxAmount;
                $return['tax_debit'] = $taxAmount;
            } else {
                if ($bookingKeepingAccount->type === 'r') {
                    $return['tax_credit'] = $taxAmount;
                } else {
                    $return['tax_debit'] = $taxAmount;
                }
            }
        }

        return $return;
    }

    public static function findAccountIdByNumber($accountNumber)
    {
        $account = BookkeepingAccount::where('account_number', $accountNumber)->first();
        if ($account) {
            return $account->id;
        }

        return 0;
    }

    public function getLabelAttribute(): string
    {
        return $this->account_number.' '.$this->name;
    }

    public function tax(): HasOne
    {
        return $this->hasOne(Tax::class, 'id', 'tax_id');
    }
}
