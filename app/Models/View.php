<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

/**
 * @property-read Model|\Eloquent $viewable
 * @method static \Illuminate\Database\Eloquent\Builder<static>|View newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|View newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|View query()
 * @mixin \Eloquent
 */
class View extends Model
{
    protected function casts(): array
    {
        return [
            'is_pinned' => 'boolean',
            'data' => 'array',
        ];
    }

    public function viewable(): MorphTo
    {
        return $this->morphTo();
    }
}
