<?php

namespace App\Models;

use App\Enums\PagebreakEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property PagebreakEnum $pagebreak
 * @property-read Offer|null $offer
 * @property-read OfferSection|null $section
 *
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfferOfferSection newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfferOfferSection newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|OfferOfferSection query()
 *
 * @mixin \Eloquent
 */
class OfferOfferSection extends Model
{
    protected $fillable = [
        'offer_id',
        'pos',
        'title',
        'section_id',
        'content',
        'pagebreak',
    ];

    protected function casts(): array
    {
        return [
            'pagebreak' => PagebreakEnum::class,
        ];
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }

    public function section(): BelongsTo
    {
        return $this->belongsTo(OfferSection::class);
    }
}
