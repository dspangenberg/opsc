<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfferSection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfferSection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfferSection query()
 * @mixin \Eloquent
 */
class OfferSection extends Model
{
    protected $fillable = [
        'name',
        'title',
        'is_required',
        'pos',
        'default_content',
    ];

    protected $attributes = [
        'is_required' => false,
        'name' => ''
    ];
    protected function casts(): array
    {
        return [
            'is_required' => 'boolean',
        ];
    }
}
