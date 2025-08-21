<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Mtvs\EloquentHashids\HasHashid;
use Mtvs\EloquentHashids\HashidRouting;

/**
 *
 *
 * @property int $id
 * @property string $parent_type
 * @property string $parent_id
 * @property array $data
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $hid
 * @method static Builder<static>|TempData newModelQuery()
 * @method static Builder<static>|TempData newQuery()
 * @method static Builder<static>|TempData query()
 * @method static Builder<static>|TempData whereCreatedAt($value)
 * @method static Builder<static>|TempData whereData($value)
 * @method static Builder<static>|TempData whereId($value)
 * @method static Builder<static>|TempData whereParentId($value)
 * @method static Builder<static>|TempData whereParentType($value)
 * @method static Builder<static>|TempData whereUpdatedAt($value)
 * @mixin IdeHelperTempData
 * @mixin Eloquent
 */
class TempData extends Model
{

    use HasHashid, HashidRouting;

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
        return $this->hashid();
    }

    public static function getByHid(string $hid): Model
    {
        return TempData::findByHashidOrFail($hid);
    }
}
