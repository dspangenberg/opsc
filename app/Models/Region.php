<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Region newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Region newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Region query()
 * @mixin \Eloquent
 */
class Region extends Model
{
    protected $fillable = [
        'name',
        'country_id',
        'short_name',
        'place_short_name',
    ];
}
