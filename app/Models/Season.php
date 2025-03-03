<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
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
 * @method static Builder<static>|Season newModelQuery()
 * @method static Builder<static>|Season newQuery()
 * @method static Builder<static>|Season onlyTrashed()
 * @method static Builder<static>|Season query()
 * @method static Builder<static>|Season withTrashed()
 * @method static Builder<static>|Season withoutTrashed()
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \App\Models\SeasonPeriod> $periods
 * @property-read int|null $periods_count
 * @mixin Eloquent
 */
class Season extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'is_default',
        'color',
        'booking_mode',
        'has_season_related_restrictions',
    ];

    protected $attributes = [
        'name' => '',
        'is_default' => false,
        'has_season_related_restrictions' => false,
        'booking_mode' => 1,
        'color' => '#3B82F6',
    ];

    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
            'has_season_related_restrictions' => 'boolean',
        ];
    }

    public function periods(): HasMany
    {
        return $this->hasMany(SeasonPeriod::class);
    }

}
