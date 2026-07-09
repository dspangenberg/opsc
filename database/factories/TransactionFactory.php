<?php

namespace Database\Factories;

use App\Models\Transaction;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Transaction>
 */
class TransactionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'mm_ref' => fake()->unique()->bothify('??-####'),
            'contact_id' => 1,
            'bank_account_id' => 1,
            'valued_on' => fake()->date(),
            'currency' => 'EUR',
            'name' => fake()->name(),
            'amount' => fake()->randomFloat(2, -1000, 1000),
        ];
    }
}
