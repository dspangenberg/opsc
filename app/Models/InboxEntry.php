<?php

namespace App\Models;

use App\Enums\InboxEntryStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InboxEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'from',
        'to',
        'payload',
        'status',
        'processed_by',
        'processed_at',
        'received_at',
        'message_id',
        'user_id'
    ];

    protected $casts = [
        'payload' => 'array',
        'processed_at' => 'datetime',
        'received_at' => 'datetime',
        'status' => InboxEntryStatus::class,
    ];

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
    public function markAsAccepted(User $user): void
    {
        $this->update([
            'status' => InboxEntryStatus::ACCEPTED,
            'processed_by' => $user->id,
            'processed_at' => now(),
        ]);
    }

    public function markAsRejected(User $user): void
    {
        $this->update([
            'status' => InboxEntryStatus::REJECTED,
            'processed_by' => $user->id,
            'processed_at' => now(),
        ]);
    }
}
