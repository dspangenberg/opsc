<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class BookmarkFolder extends Model
{
    protected $fillable = [
        'name',
        'pos',
    ];

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class, 'bookmark_folder_id', 'id')->orderBy('name');
    }
}
