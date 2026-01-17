<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentTag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentTag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentTag query()
 * @mixin \Eloquent
 */
class DocumentTag extends Model
{
    protected $fillable = [
        'name',
        'color',
        'icon',
    ];

    protected $attributes = [
        's3path' => '',
    ];
}
