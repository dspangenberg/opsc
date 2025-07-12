<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property string $iban
 * @property string $bic
 * @property string $bank_code
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property string $prefix
 * @property int $bookkeeping_account_id
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount query()
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereBankCode($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereBic($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereBookkeepingAccountId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereIban($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereName($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount wherePrefix($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount whereUpdatedAt($value)
 * @property int $pos
 * @method static \Illuminate\Database\Eloquent\Builder|BankAccount wherePos($value)
 * @mixin \Eloquent
 */
class BankAccount extends Model
{
}
