<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Plank\Mediable\Mediable;

class DropboxMail extends Model
{
    use Mediable;

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
        'is_inbound',
        'is_visible_in_activity',
    ];

    public function dropbox(): BelongsTo
    {
        return $this->belongsTo(Dropbox::class);
    }

    public function links(): HasMany
    {
        return $this->hasMany(DropboxMailLink::class);
    }

    public function attachments(): HasMany
    {
        return $this->hasMany(DropboxMailAttachment::class);
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
