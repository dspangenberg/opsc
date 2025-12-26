<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

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
