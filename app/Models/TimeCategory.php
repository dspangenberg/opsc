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
 * @property string $short_name
 * @property int $pos
 * @property int $is_default
 * @property string $hourly
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @method static Builder|TimeCategory newModelQuery()
 * @method static Builder|TimeCategory newQuery()
 * @method static Builder|TimeCategory query()
 * @method static Builder|TimeCategory whereCreatedAt($value)
 * @method static Builder|TimeCategory whereHourly($value)
 * @method static Builder|TimeCategory whereId($value)
 * @method static Builder|TimeCategory whereIsDefault($value)
 * @method static Builder|TimeCategory whereName($value)
 * @method static Builder|TimeCategory wherePos($value)
 * @method static Builder|TimeCategory whereShortName($value)
 * @method static Builder|TimeCategory whereUpdatedAt($value)
 * @mixin Eloquent
 */
class TimeCategory extends Model
{
    protected $fillable = [
        'name',
        'short_name',
        'pos',
        'is_default',
        'hourly',
    ];
}
