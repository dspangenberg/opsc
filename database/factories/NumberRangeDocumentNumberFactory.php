<?php

namespace Database\Factories;

use App\Models\NumberRange;
use App\Models\NumberRangeDocumentNumber;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NumberRangeDocumentNumber>
 */
class NumberRangeDocumentNumberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number_range_id' => NumberRange::factory(),
            'year' => now()->year,
            'counter' => 0,
            'document_number' => '0',
        ];
    }
}
