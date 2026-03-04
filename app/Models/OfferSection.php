<?php

namespace App\Models;

use App\Enums\PagebreakEnum;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

/**
 * @method static Builder<static>|OfferSection newModelQuery()
 * @method static Builder<static>|OfferSection newQuery()
 * @method static Builder<static>|OfferSection query()
 * @mixin Eloquent
 */
class OfferSection extends Model
{
    protected $fillable = [
        'name',
        'title',
        'pos',
        'default_content',
        'pagebreak',
    ];

    protected $attributes = [
        'name' => ''
    ];
    protected function casts(): array
    {
        return [
            'pagebreak' => PagebreakEnum::class,
        ];
    }
}
