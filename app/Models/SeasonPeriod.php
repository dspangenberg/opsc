<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use DateTimeInterface;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * 
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SeasonPeriod newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SeasonPeriod newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SeasonPeriod onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SeasonPeriod query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SeasonPeriod withTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|SeasonPeriod withoutTrashed()
 * @mixin \Eloquent
 */
class SeasonPeriod extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'season_id',
        'begin_on',
        'end_on',
    ];


    protected $dates = ['begin_on', 'end_on'];
    protected $dateFormat = 'Y-m-d';

    protected function casts(): array
    {
        return [
            'begin_on' => 'date',
            'end_on' => 'date',
        ];
    }
}
