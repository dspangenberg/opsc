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
 * @property string|null $color
 * @property string|null $icon
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|ProjectCategory newModelQuery()
 * @method static Builder|ProjectCategory newQuery()
 * @method static Builder|ProjectCategory query()
 * @method static Builder|ProjectCategory whereColor($value)
 * @method static Builder|ProjectCategory whereCreatedAt($value)
 * @method static Builder|ProjectCategory whereIcon($value)
 * @method static Builder|ProjectCategory whereId($value)
 * @method static Builder|ProjectCategory whereName($value)
 * @method static Builder|ProjectCategory whereUpdatedAt($value)
 * @mixin Eloquent
 */
class ProjectCategory extends Model
{
    protected $fillable = [
        'name',
        'color',
        'icon',
    ];
}
