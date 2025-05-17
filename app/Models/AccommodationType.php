<?php

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
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static Builder<static>|AccommodationType newModelQuery()
 * @method static Builder<static>|AccommodationType newQuery()
 * @method static Builder<static>|AccommodationType query()
 *
 * @mixin Eloquent
 */
class AccommodationType extends Model
{
    protected $fillable = [
        'name',
        'is_from_system_catalog',
    ];
}
