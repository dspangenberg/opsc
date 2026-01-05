<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
