<?php

namespace Database\Factories;

use App\Models\Contact;
use App\Models\Invoice;
use App\Models\InvoiceType;
use App\Models\PaymentDeadline;
use App\Models\Tax;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Invoice>
 */
class InvoiceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'contact_id' => Contact::factory(),
            'issued_on' => now()->toDateString(),
            'due_on' => now()->addDays(14)->toDateString(),
            'payment_deadline_id' => PaymentDeadline::factory(),
            'type_id' => InvoiceType::factory(),
            'tax_id' => Tax::factory(),
            'is_draft' => false,
            'is_external' => false,
        ];
    }
}
