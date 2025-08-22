<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|ContactPhone newModelQuery()
 * @method static Builder<static>|ContactPhone newQuery()
 * @method static Builder<static>|ContactPhone query()
 * @mixin Eloquent
 */
class ContactPhone extends Model
{
    protected $fillable = [
        'contact_id',
        'phone_category_id',
        'pos',
        'phone',
    ];
}
