<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DropboxInbox extends Model
{
    protected $fillable = [
        'message_id',
        'payload',
        'dropbox_id',
        'is_private'
    ];

    public function dropbox(): BelongsTo
    {
        return $this->belongsTo(Dropbox::class);
    }

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'is_private' => 'boolean',
        ];
    }
}
