<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read User|null $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxUser newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxUser newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxUser query()
 *
 * @mixin \Eloquent
 */
class DropboxUser extends Model
{
    protected $fillable = [
        'user_id',
        'user_id',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
