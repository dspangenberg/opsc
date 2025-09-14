<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Currency extends Model
{
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }
}
