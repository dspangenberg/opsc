<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @method static Builder<static>|Calendar newModelQuery()
 * @method static Builder<static>|Calendar newQuery()
 * @method static Builder<static>|Calendar onlyTrashed()
 * @method static Builder<static>|Calendar query()
 * @method static Builder<static>|Calendar withTrashed()
 * @method static Builder<static>|Calendar withoutTrashed()
 * @property bool|mixed $is_default
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\CalendarEvent> $events
 * @property-read int|null $events_count
 * @mixin Eloquent
 */
class Calendar extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'icon',
        'color',
        'is_default',
    ];

    protected $attributes = [
        'name' => 'Mein Kalender',
        'is_default' => false,
        'icon' => 'CalendarRange',
        'color' => '#2196F3',
    ];

    public function events(): HasMany
    {
        return $this->hasMany(CalendarEvent::class);
    }
}
