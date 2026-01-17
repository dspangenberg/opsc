<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TextModule newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TextModule newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TextModule onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TextModule query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TextModule withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TextModule withoutTrashed()
 * @mixin \Eloquent
 */
class TextModule extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'content',
    ];
}
