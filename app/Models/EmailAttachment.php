<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\Email|null $email
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailAttachment newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailAttachment newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|EmailAttachment query()
 *
 * @mixin \Eloquent
 */
class EmailAttachment extends Model
{
    protected $fillable = [
        'email_id',
        'filename',
        'mime_type',
        'size_in_bytes',
        'storage_path',
    ];

    public function email(): BelongsTo
    {
        return $this->belongsTo(Email::class);
    }
}
