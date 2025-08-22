<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property-read \App\Models\NumberRange|null $range
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NumberRangeDocumentNumber newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NumberRangeDocumentNumber newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|NumberRangeDocumentNumber query()
 * @mixin \Eloquent
 */
class NumberRangeDocumentNumber extends Model
{
    protected $fillable = [
        'number_range_id',
        'year',
        'counter',
        'document_number',
    ];

    public function range(): HasOne
    {
        return $this->hasOne(NumberRange::class, 'id', 'number_range_id');
    }
}
