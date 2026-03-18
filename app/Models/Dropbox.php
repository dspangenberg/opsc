<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dropbox extends Model
{
    protected $fillable = [
        'email_address',
        'name',
        'is_shared',
        'is_auto_processing',
    ];

    protected function casts(): array
    {
        return [
            'is_shared' => 'boolean',
            'is_auto_processing' => 'boolean',
        ];
    }
}
