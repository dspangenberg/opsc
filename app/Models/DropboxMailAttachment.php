<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
