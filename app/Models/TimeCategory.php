<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|TimeCategory newModelQuery()
 * @method static Builder<static>|TimeCategory newQuery()
 * @method static Builder<static>|TimeCategory query()
 * @mixin Eloquent
 */
class TimeCategory extends Model
{
    protected $fillable = [
        'name',
        'short_name',
        'pos',
        'is_default',
        'hourly',
    ];
}
