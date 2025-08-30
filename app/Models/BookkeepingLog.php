<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id
 * @property string $parent_model
 * @property string $parent_id
 * @property string $text
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 *
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog whereParentModel($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog whereText($value)
 * @method static \Illuminate\Database\Eloquent\Builder|BookkeepingLog whereUpdatedAt($value)
 *
 * @mixin \Eloquent
 */
class BookkeepingLog extends Model
{
    protected $fillable = [
        'parent_model',
        'parent_id',
        'text',
    ];
}
