<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BankAccount extends Model
{
    protected $fillable = [
        'name',
        'iban',
        'bic',
        'account_owner',
        'bank_name',
        'email',
        'prefix',
        'is_default',
        'is_paypal',
        'is_closed',
        'bookkeeping_account_id',
        'pos',
    ];
}
