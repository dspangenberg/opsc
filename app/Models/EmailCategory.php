<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|EmailCategory newModelQuery()
 * @method static Builder<static>|EmailCategory newQuery()
 * @method static Builder<static>|EmailCategory query()
 * @mixin Eloquent
 */
class EmailCategory extends Model
{
    protected $fillable = [
        'name',
        'days',
        'is_immediately',
        'is_default',
    ];
}
