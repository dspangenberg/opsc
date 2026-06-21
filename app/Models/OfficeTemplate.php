<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Plank\Mediable\Mediable;

class OfficeTemplate extends Model
{
    use Mediable;

    protected $fillable = [
        'name',
        'is_default',
    ];

    protected $attributes = [
        'is_default' => false,
        'name' => '',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }
}
