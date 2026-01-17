<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property-read NumberRange|null $range
 * @method static Builder<static>|NumberRangeDocumentNumber newModelQuery()
 * @method static Builder<static>|NumberRangeDocumentNumber newQuery()
 * @method static Builder<static>|NumberRangeDocumentNumber query()
 * @mixin Eloquent
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
