<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentType newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentType newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentType query()
 * @mixin \Eloquent
 */
class DocumentType extends Model
{
    protected $fillable = [
        'parent_id',
        'name',
        'color',
        'icon',
    ];

    protected $attributes = [
        'parent_id' => 0,
        'name' => '',
        'color' => '',
        'icon' => '',
    ];
}
