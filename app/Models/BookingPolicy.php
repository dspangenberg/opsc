<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPolicy newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPolicy newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPolicy onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPolicy query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPolicy withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookingPolicy withoutTrashed()
 * @mixin \Eloquent
 */
class BookingPolicy extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'is_default',
        'age_min',
        'arrival_days',
        'departure_days',
        'stay_min',
        'stay_max',
        'checkin',
        'checkout',
    ];

    protected $attributes = [
        'name' => '',
        'is_default' => false,
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }
}
