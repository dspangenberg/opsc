<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DropboxMail extends Model
{
    protected $fillable = [
        'message_id',
        'subject',
        'text',
        'references',
        'from',
        'to',
        'html',
        'dropbox_id',
        'timestamp',
    ];

    public function dropbox(): BelongsTo
    {
        return $this->belongsTo(Dropbox::class);
    }

    protected function casts(): array
    {
        return [
            'references' => 'array',
            'to' => 'array',
            'timestamp' => 'datetime',
        ];
    }
}
