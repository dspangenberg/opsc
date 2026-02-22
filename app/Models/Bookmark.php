<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Bookmark extends Model
{
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
        'sidebar_title'
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
        return $this->belongsTo(BookmarkFolder::class, 'id', 'bookmark_folder_id');
    }

    protected function casts(): array
    {
        return [
            'route_params' => 'array',
            'is_pinned' => 'boolean',
        ];
    }
}
