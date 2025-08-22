<?php

namespace App\Models;

use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

/**
 * @method static Builder<static>|NumberRange newModelQuery()
 * @method static Builder<static>|NumberRange newQuery()
 * @method static Builder<static>|NumberRange query()
 * @mixin Eloquent
 */
class NumberRange extends Model
{
    protected $fillable = [
        'name',
        'prefix',
        'model',
    ];

    public static function createDocumentNumber(Invoice|Receipt|Transaction $parent, string $dateField, string $alternatePrefix = ''): int
    {
        $year = $parent[$dateField]->year;

        if ($alternatePrefix) {
            $numberRange = NumberRange::where('prefix', $alternatePrefix)->first();
        } else {
            $numberRange = NumberRange::where('model', $parent::class)->first();
        }

        if ($numberRange) {
            $counter = NumberRangeDocumentNumber::query()->where('number_range_id', $numberRange->id)->where('year',
                $year)->max('counter');
            $counter++;

            $documentNumber = NumberRangeDocumentNumber::create(
                [
                    'number_range_id' => $numberRange->id,
                    'year' => $year,
                    'counter' => $counter,
                    'document_number' => "$numberRange->prefix-$year-$counter",
                ]
            );

            return $documentNumber->id;
        }

        return 0;
    }
}
