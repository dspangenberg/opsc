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
        'dropbox_id', s,
        'payload'

        'timestamp',
        'is_private',
        'is_processed',
        'full_payload',
        'plain_body',
        'cc',
        'bcc',
        'in_reply_to',
        'payload'
    ];

    public function dropbox(): BelongsTo
    {
        return $this->belongsTo(Dropbox::class);
    }

    protected $attributes = [
        'is_private' => false,
        'is_processed' => false,
    ];

    protected function casts(): array
    {
        return [
            'references' => 'array',
            'to' => 'array',
            'cc' => 'array',
            'bcc' => 'array',
            'timestamp' => 'datetime',
            'full_payload' => 'array'
        ];
    }
}
