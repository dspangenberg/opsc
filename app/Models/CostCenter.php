<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\BookkeepingAccount|null $account
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CostCenter newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CostCenter newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CostCenter query()
 * @mixin \Eloquent
 */
class CostCenter extends Model
{
    protected $with = ['account'];
    protected $fillable = [
        'name',
        'bookkeeping_account_id',
    ];

    protected $attributes = [
        'name' => '',
        'bookkeeping_account_id' => 0,
    ];



    public function account(): BelongsTo
    {
        return $this->belongsTo(BookkeepingAccount::class, 'bookkeeping_account_id', 'id');
    }
}
