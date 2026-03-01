<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EmailAccount extends Model
{
    protected $fillable = [
        'name',
        'email',
        'smtp_username',
        'signature',
    ];

    protected $hidden = [
        'smtp_password'
    ];
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'smtp_password' => 'encrypted'
        ];
    }
}
