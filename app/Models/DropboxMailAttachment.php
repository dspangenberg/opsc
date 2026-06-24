<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Plank\Mediable\Mediable;

class DropboxMailAttachment extends Model
{
    use Mediable;

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
