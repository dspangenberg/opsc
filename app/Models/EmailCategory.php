<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @property int $id
 * @property string $name
 * @property int $type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 *
 * @method static Builder|EmailCategory newModelQuery()
 * @method static Builder|EmailCategory newQuery()
 * @method static Builder|EmailCategory query()
 * @method static Builder|EmailCategory whereCreatedAt($value)
 * @method static Builder|EmailCategory whereId($value)
 * @method static Builder|EmailCategory whereName($value)
 * @method static Builder|EmailCategory whereType($value)
 * @method static Builder|EmailCategory whereUpdatedAt($value)
 *
 * @mixin Eloquent
 */
class EmailCategory extends Model
{
    protected $fillable = [
        'name',
        'days',
        'is_immediately',
        'is_default',
    ];
}
