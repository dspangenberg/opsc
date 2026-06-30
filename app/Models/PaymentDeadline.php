<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PaymentDeadline extends Model
{
    protected $fillable = [
        'name',
        'days',
        'is_default',
        'is_immediately',
        'invoice_text',
    ];
}
