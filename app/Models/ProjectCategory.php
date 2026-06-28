<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static Builder<static>|ProjectCategory newModelQuery()
 * @method static Builder<static>|ProjectCategory newQuery()
 * @method static Builder<static>|ProjectCategory query()
 * @method static \Database\Factories\ProjectCategoryFactory factory($count = null, $state = [])
 *
 * @mixin Eloquent
 */
class ProjectCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'color',
        'icon',
    ];
}
