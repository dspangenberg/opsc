<?php

namespace Database\Factories;

use App\Models\Tax;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Tax>
 */
class TaxFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => 'MwSt.',
            'invoice_text' => 'USt.',
            'value' => 19,
            'needs_vat_id' => false,
            'is_default' => true,
            'outturn_account_id' => 0,
            'default_rate_id' => 0,
        ];
    }
}
