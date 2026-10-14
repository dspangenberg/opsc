<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property-read Collection<int, Document> $documents
 * @property-read int|null $documents_count
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentTag newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentTag newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|DocumentTag query()
 *
 * @mixin \Eloquent
 */
class DocumentTag extends Model
{
    protected $fillable = [
        'name',
        'color',
        'icon',
    ];

    public function documents(): BelongsToMany
    {
        return $this->belongsToMany(Document::class);
    }
}
