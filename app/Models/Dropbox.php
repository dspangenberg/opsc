<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property-read User|null $user
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dropbox newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dropbox newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Dropbox query()
 *
 * @mixin \Eloquent
 */
class Dropbox extends Model
{
    protected $fillable = [
        'email_address',
        'name',
        'is_shared',
        'is_auto_processing',
        'token',
        'is_private_by_default',
        'user_id',
    ];

    protected function casts(): array
    {
        return [
            'is_shared' => 'boolean',
            'is_auto_processing' => 'boolean',
            'is_private_by_default' => 'boolean',
        ];
    }

    protected $attributes = [
        'is_private_by_default' => false,
        'is_shared' => false,
        'is_auto_processing' => false,
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function mails(): HasMany
    {
        return $this->hasMany(DropboxMail::class);
    }
}
