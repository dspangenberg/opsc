<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property-read \App\Models\Letterhead|null $letterhead
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PrintLayout newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PrintLayout newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PrintLayout query()
 * @mixin \Eloquent
 */
class PrintLayout extends Model
{
    protected $fillable = [
        'name',
        'title',
        'letterhead_id',
        'css',
    ];

    public function letterhead(): BelongsTo
    {
        return $this->belongsTo(Letterhead::class);
    }
}
