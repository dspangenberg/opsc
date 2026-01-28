<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Plank\Mediable\Mediable;
class DocumentDownload extends Model
{

    use Mediable;
    protected $fillable = [
        'type',
        'ids',
    ];

    protected function casts(): array
    {
        return [
            'ids' => 'array',
        ];
    }
}
