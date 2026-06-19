<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Plank\Mediable\Mediable;
/**
 * @property-read \Illuminate\Database\Eloquent\Collection<int, \Plank\Mediable\Media> $media
 * @property-read int|null $media_count
 * @method static \Plank\Mediable\MediableCollection<int, static> all($columns = ['*'])
 * @method static \Plank\Mediable\MediableCollection<int, static> get($columns = ['*'])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload whereHasMedia($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload whereHasMediaMatchAll($tags)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload withMedia($tags = [], bool $matchAll = false, bool $withVariants = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload withMediaAndVariants($tags = [], bool $matchAll = false)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload withMediaAndVariantsMatchAll($tags = [])
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentDownload withMediaMatchAll(bool $tags = [], bool $withVariants = false)
 * @mixin \Eloquent
 */
class DocumentDownload extends Model
{

    use Mediable;
    protected $fillable = [
        'type',
        'ids',
    ];

    protected function casts(): array
    {
        return [
            'ids' => 'array',
        ];
    }
}
