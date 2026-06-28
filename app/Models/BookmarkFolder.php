<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read Collection<int, Bookmark> $bookmarks
 * @property-read int|null $bookmarks_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookmarkFolder newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookmarkFolder newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookmarkFolder onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookmarkFolder query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookmarkFolder withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|BookmarkFolder withoutTrashed()
 *
 * @mixin \Eloquent
 */
class BookmarkFolder extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'pos',
    ];

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class, 'bookmark_folder_id', 'id')->orderBy('name');
    }
}
