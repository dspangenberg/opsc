<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\NumberRange;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<NumberRange>
 */
class NumberRangeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'Rechnungen',
            'prefix' => 'INV-'.uniqid(),
            'model' => Invoice::class,
        ];
    }
}
