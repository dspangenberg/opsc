<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property int $days
 * @property int $is_immediately
 * @property int $is_default
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|PaymentDeadline newModelQuery()
 * @method static Builder|PaymentDeadline newQuery()
 * @method static Builder|PaymentDeadline query()
 * @method static Builder|PaymentDeadline whereCreatedAt($value)
 * @method static Builder|PaymentDeadline whereDays($value)
 * @method static Builder|PaymentDeadline whereId($value)
 * @method static Builder|PaymentDeadline whereIsDefault($value)
 * @method static Builder|PaymentDeadline whereIsImmediately($value)
 * @method static Builder|PaymentDeadline whereName($value)
 * @method static Builder|PaymentDeadline whereUpdatedAt($value)
 *
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
