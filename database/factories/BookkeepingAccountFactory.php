<?php

namespace Database\Factories;

use App\Models\BookkeepingAccount;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<BookkeepingAccount>
 */
class BookkeepingAccountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_number' => fake()->unique()->numberBetween(1000, 99999),
            'name' => fake()->company(),
            'type' => 'e',
            'tax_id' => 0,
        ];
    }
}
