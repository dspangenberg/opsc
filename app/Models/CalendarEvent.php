<?php
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CalendarEvent newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CalendarEvent newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CalendarEvent onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CalendarEvent query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CalendarEvent withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|CalendarEvent withoutTrashed()
 * @mixin \Eloquent
 */
class CalendarEvent extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'title',
        'start_at',
        'end_at',
        'is_fullday',
        'body',
        'category_id',
        'location_id',
        'website',
        'ticketshop_id',
        'calendar_id',
    ];

    protected function casts(): array
    {
        return [
            'start_at' => 'datetime',
            'is_fullday' => 'boolean',
        ];
    }
}
