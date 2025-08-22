<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property string $iso_code
 * @property string $vehicle_code
 * @property string $country_code
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder<static>|Country newModelQuery()
 * @method static Builder<static>|Country newQuery()
 * @method static Builder<static>|Country query()
 * @method static Builder<static>|Country whereCountryCode($value)
 * @method static Builder<static>|Country whereCreatedAt($value)
 * @method static Builder<static>|Country whereId($value)
 * @method static Builder<static>|Country whereIsoCode($value)
 * @method static Builder<static>|Country whereName($value)
 * @method static Builder<static>|Country whereUpdatedAt($value)
 * @method static Builder<static>|Country whereVehicleCode($value)
 * @mixin Eloquent
 */
class Country extends Model
{
    protected $fillable = [
        'name',
        'iso_code',
        'vehicle_code',
        'country_code',
    ];
}
