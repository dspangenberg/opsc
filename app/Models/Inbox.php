<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inbox newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inbox newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inbox onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inbox query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inbox withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Inbox withoutTrashed()
 * @mixin \Eloquent
 */
class Inbox extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'email_address',
        'name',
        'is_default',
        'allowed_senders',
    ];

    protected $attributes = [
        'name' => '',
        'is_default' => false,
        'allowed_senders' => '{}',
    ];

    protected function casts(): array
    {
        return [
            'allowed_senders' => 'array',
        ];
    }
}
