<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
