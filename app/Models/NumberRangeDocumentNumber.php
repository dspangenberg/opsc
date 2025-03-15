<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * 
 *
 * @property int $id
 * @property int $number_range_id
 * @property int $year
 * @property int $document_number
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers query()
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers whereDocumentNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers whereNumberRangeId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers whereYear($value)
 * @property int $counter
 * @method static \Illuminate\Database\Eloquent\Builder|NumberRangeDocumentNumbers whereCounter($value)
 * @property-read \App\Models\NumberRange|null $range
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
