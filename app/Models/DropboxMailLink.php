<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

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
