<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

/*
 * Ooboo.core and this file are licensed under the terms of the European Union Public License (EUPL)
 *  (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 *  os@ooboo.core
 *  http://ooboo.core
 *
 *
 */

namespace App\Models;

use Eloquent;
use Illuminate\Contracts\Database\Query\Expression;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use MatanYadaev\EloquentSpatial\Objects\Geometry;
use MatanYadaev\EloquentSpatial\Objects\Point;
use MatanYadaev\EloquentSpatial\Traits\HasSpatial;

/**
 * 
 *
 * @method static Builder<static>|Accommodation newModelQuery()
 * @method static Builder<static>|Accommodation newQuery()
 * @method static Builder<static>|Accommodation onlyTrashed()
 * @method static Builder<static>|Accommodation query()
 * @method static Builder<static>|Accommodation withTrashed()
 * @method static Builder<static>|Accommodation withoutTrashed()
 * @mixin IdeHelperAccommodation
 * @property Geometry $coordinates
 * @method static Builder<static>|Accommodation orderByDistance(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn, string $direction = 'asc')
 * @method static Builder<static>|Accommodation orderByDistanceSphere(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn, string $direction = 'asc')
 * @method static Builder<static>|Accommodation whereContains(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereCrosses(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereDisjoint(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereDistance(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn, string $operator, int|float $value)
 * @method static Builder<static>|Accommodation whereDistanceSphere(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn, string $operator, int|float $value)
 * @method static Builder<static>|Accommodation whereEquals(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereIntersects(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereNotContains(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereNotWithin(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereOverlaps(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereSrid(Expression|Geometry|string $column, string $operator, int|float $value)
 * @method static Builder<static>|Accommodation whereTouches(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation whereWithin(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn)
 * @method static Builder<static>|Accommodation withCentroid(Expression|Geometry|string $column, string $alias = 'centroid')
 * @method static Builder<static>|Accommodation withDistance(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn, string $alias = 'distance')
 * @method static Builder<static>|Accommodation withDistanceSphere(Expression|Geometry|string $column, Expression|Geometry|string $geometryOrColumn, string $alias = 'distance')
 * @property-read \App\Models\AccommodationType|null $type
 * @mixin Eloquent
 */
class Accommodation extends Model
{
    use SoftDeletes, HasSpatial;

    protected $fillable = [
        'name',
        'type_id',
        'place_id',
        'coordinates',
        'street',
        'zip',
        'city',
        'country_id',
        'region_id',
        'phone',
        'email',
        'website'
    ];

    protected $attributes = [
        'name' => '',
        'type_id' => 0,
        'place_id' => '',
        'street' => '',
        'zip' => '',
        'city' => '',
        'country_id' => 0,
        'region_id' => 0,
        'website' => '',
        'phone' => '',
        'email' => ''
    ];

    protected $casts = [
        'coordinates' => Point::class
    ];

    public function type(): BelongsTo
    {
        return $this->belongsTo(AccommodationType::class);
    }
}
