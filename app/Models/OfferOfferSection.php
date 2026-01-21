<?php

namespace App\Models;

use App\Enums\PagebreakEnum;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

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
