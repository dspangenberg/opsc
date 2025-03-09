<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * 
 *
 * @property int $id
 * @property string $name
 * @property int $type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|AddressCategory newModelQuery()
 * @method static Builder|AddressCategory newQuery()
 * @method static Builder|AddressCategory query()
 * @method static Builder|AddressCategory whereCreatedAt($value)
 * @method static Builder|AddressCategory whereId($value)
 * @method static Builder|AddressCategory whereName($value)
 * @method static Builder|AddressCategory whereType($value)
 * @method static Builder|AddressCategory whereUpdatedAt($value)
 * @mixin Eloquent
 */
class AddressCategory extends Model
{
    protected $fillable = [
        'name',
        'type',
    ];
}
