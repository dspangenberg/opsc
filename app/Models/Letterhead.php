<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Plank\Mediable\Mediable;
class Letterhead extends Model
{
    use Mediable;

    protected $fillable = [
        'title',
        'css',
        'is_multi',
        'is_default',
    ];

    protected $attributes = [
        'is_multi' => true,
        'is_default' => false,
        'title' => '',
        'css' => '',
    ];
    protected function casts(): array
    {
        return [
            'is_multi' => 'boolean',
            'is_default' => 'boolean',
        ];
    }
}
