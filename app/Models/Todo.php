<?php

namespace App\Models;

use Database\Factories\TodoFactory;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @method static Builder<Todo> newModelQuery()
 * @method static Builder<Todo> newQuery()
 * @method static Builder<Todo> query()
 */
class Todo extends Model
{
    /** @use HasFactory<TodoFactory> */
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'todoable_type',
        'todoable_id',
        'title',
        'completed_at',
        'due_at',
        'created_by_user_id',
        'assigned_to_user_id',
    ];

    protected $appends = [
        'todobable_description',
        'is_overdue',
    ];

    protected function casts(): array
    {
        return [
            'due_at' => 'datetime',
            'completed_at' => 'datetime',
        ];
    }

    public function assigned_to(): BelongsTo
    {
        return $this->belongsTo(User::class, 'assigned_to_user_id', 'id');
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by_user_id', 'id');
    }

    public function todoable(): MorphTo
    {
        return $this->morphTo();
    }

    public function getIsOverdueAttribute(): bool
    {
        return $this->completed_at === null
            && $this->due_at !== null
            && $this->due_at->isPast();
    }

    public function getTodobableDescriptionAttribute(): ?string
    {
        return match (true) {
            $this->todoable instanceof Project => $this->todoable->name,
            $this->todoable instanceof Contact => $this->todoable->full_name,
            default => null,
        };
    }
}
