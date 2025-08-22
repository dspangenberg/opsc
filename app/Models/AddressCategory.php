<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|AddressCategory newModelQuery()
 * @method static Builder<static>|AddressCategory newQuery()
 * @method static Builder<static>|AddressCategory query()
 * @mixin Eloquent
 */
class AddressCategory extends Model
{
    protected $fillable = [
        'name',
        'is_invoice_address',
    ];
}
