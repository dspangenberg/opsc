<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;

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
