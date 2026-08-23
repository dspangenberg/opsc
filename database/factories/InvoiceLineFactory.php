<?php

namespace Database\Factories;

use App\Models\Invoice;
use App\Models\InvoiceLine;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<InvoiceLine>
 */
class InvoiceLineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'invoice_id' => Invoice::factory(),
            'quantity' => 1,
            'unit' => 'Stk.',
            'text' => 'Testleistung',
            'price' => 100,
            'amount' => 100,
            'tax' => 19,
            'type_id' => 0,
            'tax_id' => 0,
            'tax_rate_id' => 0,
            'pos' => 1,
        ];
    }
}
