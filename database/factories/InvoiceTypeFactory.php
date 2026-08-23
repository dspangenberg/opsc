<?php

namespace Database\Factories;

use App\Models\InvoiceType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvoiceType>
 */
class InvoiceTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'print_name' => 'Rechnung',
            'display_name' => 'Rechnung',
            'key' => 'invoice',
            'abbreviation' => 'RG',
            'zugferd_id' => '380',
        ];
    }
}
