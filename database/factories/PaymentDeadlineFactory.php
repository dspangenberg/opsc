<?php

namespace Database\Factories;

use App\Models\PaymentDeadline;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<PaymentDeadline>
 */
class PaymentDeadlineFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => '14 Tage',
            'days' => 14,
            'is_default' => true,
            'is_immediately' => false,
            'invoice_text' => 'Zahlbar bis zum $dueDate.',
        ];
    }
}
