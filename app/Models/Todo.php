<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property-read DropboxMail|null $dropboxMail
 * @property-read Model|Eloquent $mailable
 *
 * @method static Builder<static>|DropboxMailLink newModelQuery()
 * @method static Builder<static>|DropboxMailLink newQuery()
 * @method static Builder<static>|DropboxMailLink query()
 *
 * @mixin Eloquent
 */
class Todo extends Model
{
    protected $fillable = [
        'todoable_type',
        'todoable_id',
        'title',
        'completed_at',
        'due_at',
        'created_by_user_id',
        'assigned_to_user_id',
    ];

    public function assigned_to(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'assigned_to_user_id');
    }

    public function created_by(): BelongsTo
    {
        return $this->belongsTo(User::class, 'id', 'created_by_user_id');
    }

    public function todoable(): MorphTo
    {
        return $this->morphTo();
    }
}
