<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property-read DropboxMail|null $dropboxMail
 * @property-read Model|\Eloquent $mailable
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxMailLink newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxMailLink newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxMailLink query()
 *
 * @mixin \Eloquent
 */
class DropboxMailLink extends Model
{
    protected $fillable = [
        'mailable_type',
        'mailable_id',
        'dropbox_mail_id',
    ];

    public function dropboxMail(): BelongsTo
    {
        return $this->belongsTo(DropboxMail::class);
    }

    public function mailable(): MorphTo
    {
        return $this->morphTo();
    }
}
