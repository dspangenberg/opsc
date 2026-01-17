<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Plank\Mediable\Mediable;
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Plank\Mediable\Media> $media
 * @property-read int|null $media_count
 * @method static \Plank\Mediable\MediableCollection<int, static> all($columns = ['*'])
 * @method static \Plank\Mediable\MediableCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead whereHasMedia($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead whereHasMediaMatchAll($tags)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead withMediaAndVariantsMatchAll($tags = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Letterhead withMediaMatchAll(array|string  $tags = [], bool $withVariants = false)
 * @mixin \Eloquent
 */
class Letterhead extends Model
{
    use Mediable;

    protected $fillable = [
        'title',
        'css',
        'is_multi',
        'is_default',
    ];

    protected $attributes = [
        'is_multi' => true,
        'is_default' => false,
        'title' => '',
        'css' => '',
    ];
    protected function casts(): array
    {
        return [
            'is_multi' => 'boolean',
            'is_default' => 'boolean',
        ];
    }
}
