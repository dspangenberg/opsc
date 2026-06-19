<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\Dropbox|null $dropbox
 * @property-read array $attachments
 * @property-read string $from
 * @property-read string $plain_body
 * @property-read string $subject
 * @property-read array $to
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxInbox newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxInbox newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxInbox query()
 * @mixin \Eloquent
 */
class DropboxInbox extends Model
{
    protected $fillable = [
        'message_id',
        'payload',
        'dropbox_id',
        'is_private',
        'date',
        'seen_at',
    ];

    protected $appends = [
        'attachments',
        'from',
        'plain_body',
        'subject',
        'to',
    ];

    public function getPlainBodyAttribute(): string
    {
        return $this->payload['plain_body'] ?? '';
    }

    public function getSubjectAttribute(): string
    {
        return $this->payload['subject'] ?? '';
    }

    public function getFromAttribute(): string
    {
        return $this->payload['from'] ?? '';
    }

    public function getToAttribute(): array
    {
        return $this->payload['to'] ?? [];
    }

    public function getAttachmentsAttribute(): array
    {
        return $this->payload['attachments'] ?? [];
    }

    public function dropbox(): BelongsTo
    {
        return $this->belongsTo(Dropbox::class);
    }

    protected function casts(): array
    {
        return [
            'payload' => 'array',
            'is_private' => 'boolean',
            'date' => 'datetime',
            'seen_at' => 'datetime',
        ];
    }
}
