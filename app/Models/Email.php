<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Email newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Email newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Email query()
 *
 * @mixin \Eloquent
 */
class Email extends Model
{
    protected $fillable = [
        'message_id',
        'subject',
        'body_plain',
        'body_html',
        'from_email',
        'from_name',
        'to',
        'cc',
        'bcc',
        'date_sent',
        'date_received',
        'has_attachments',
        'imap_folder',
        'size_in_bytes',
        'headers',
    ];

    protected function casts(): array
    {
        return [
            'to' => 'array',
            'cc' => 'array',
            'bcc' => 'array',
            'has_attachments' => 'boolean',
            'headers' => 'array',
        ];
    }
}
