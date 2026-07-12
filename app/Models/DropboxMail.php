<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Plank\Mediable\Mediable;

class DropboxMail extends Model
{
    use Mediable, SoftDeletes;

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
            'is_inbound' => 'boolean',
            'is_visible_in_activity' => 'boolean',
        ];
    }

    public function scopeView(Builder $query, string $view): Builder
    {
        return match ($view) {
            'sent' => $query->whereNull('archived_at')->where('is_inbound', false),
            'archived' => $query->whereNotNull('archived_at'),
            'trash' => $query->onlyTrashed(),
            default => $query->whereNull('archived_at')->where('is_inbound', true),
        };
    }
}
