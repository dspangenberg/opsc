<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Torann\Hashids\Facade\Hashids;

/**
 * 
 *
 * @property int $id
 * @property string $parent_type
 * @property string $parent_id
 * @property array $data
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @property-read string $hid
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereData($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereParentId($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereParentType($value)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|TempData whereUpdatedAt($value)
 * @mixin IdeHelperTempData
 * @mixin \Eloquent
 */
class TempData extends Model
{
    protected $fillable = [
        'data',
        'parent_type',
        'parent_id',
    ];

    protected $appends = [
        'hid',
    ];

    protected $attributes = [
        'parent_id' => 0,
    ];

    protected function casts(): array
    {
        return [
            'data' => 'array',
        ];
    }

    public function getHidAttribute(): string
    {
        return Hashids::encode($this->id);
    }

    public static function getByHid(string $hid): ?TempData
    {
        $id = Hashids::decode($hid)[0];

        return TempData::findOrFail($id);
    }
}
