<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|PaymentDeadline newModelQuery()
 * @method static Builder<static>|PaymentDeadline newQuery()
 * @method static Builder<static>|PaymentDeadline query()
 * @mixin Eloquent
 */
class PaymentDeadline extends Model
{
    protected $fillable = [
        'name',
        'days',
        'is_default',
        'is_immediately',
    ];
}
