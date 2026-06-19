<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\DropboxMail|null $dropboxMail
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxMailAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxMailAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DropboxMailAttachment query()
 * @mixin \Eloquent
 */
class DropboxMailAttachment extends Model
{
    protected $fillable = [
        'dropbox_mail_id',
        'mime_type',
        'filename',
        'size',
    ];

    public function dropboxMail(): BelongsTo
    {
        return $this->belongsTo(DropboxMail::class);
    }
}
