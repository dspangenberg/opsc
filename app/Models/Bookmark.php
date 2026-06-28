<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property-read BookmarkFolder|null $folder
 * @property-read string $sidebar_title
 * @property-read string $title
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bookmark newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bookmark newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bookmark onlyTrashed()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bookmark query()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bookmark withTrashed(bool $withTrashed = true)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|Bookmark withoutTrashed()
 *
 * @mixin \Eloquent
 */
class Bookmark extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'model',
        'route_name',
        'route_params',
        'is_pinned',
        'bookmark_folder_id',
        'pos',
    ];

    protected $appends = [
        'title',
        'sidebar_title',
    ];

    public function getSidebarTitleAttribute(): string
    {
        return preg_replace('/\s*\[[^]]*]\s*/', ' ', $this->name);
    }

    public function getTitleAttribute(): string
    {
        return preg_replace('/[[\]]/', '', $this->name);
    }

    public function folder(): BelongsTo
    {
        return $this->belongsTo(BookmarkFolder::class, 'bookmark_folder_id', 'id');
    }

    protected function casts(): array
    {
        return [
            'route_params' => 'array',
            'is_pinned' => 'boolean',
        ];
    }
}
