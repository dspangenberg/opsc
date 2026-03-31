<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class DropboxMailLink extends Model
{
    protected $fillable = [
        'link_type',
        'link_id',
        'dropbox_mail_id',
    ];

    public function dropboxMail(): BelongsTo
    {
        return $this->belongsTo(DropboxMail::class);
    }
}
