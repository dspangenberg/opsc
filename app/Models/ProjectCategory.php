<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|ProjectCategory newModelQuery()
 * @method static Builder<static>|ProjectCategory newQuery()
 * @method static Builder<static>|ProjectCategory query()
 * @mixin Eloquent
 */
class ProjectCategory extends Model
{
    use \Illuminate\Database\Eloquent\Factories\HasFactory;

    protected $fillable = [
        'name',
        'color',
        'icon',
    ];
}
