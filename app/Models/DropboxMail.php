<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DropboxMail extends Model
{
    protected $fillable = [
        'message_id',
        'subject',
        'text',
        'references',
        'from',
        'to',
        'dropbox_id',
        'date',
        'is_private',
        'body',
        'cc',
        'in_reply_to',
        'seen_at',
        'mailable_type',
        'mailable_id',
    ];

    public function dropbox(): BelongsTo
    {
        return $this->belongsTo(Dropbox::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(DropboxMailLink::class);
    }

    protected $attributes = [
        'is_private' => false,
    ];

    protected function casts(): array
    {
        return [
            'references' => 'array',
            'to' => 'array',
            'cc' => 'array',
            'date' => 'datetime',
            'seen_at' => 'datetime',
        ];
    }
}
