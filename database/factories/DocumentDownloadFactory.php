<?php

namespace Database\Factories;

use App\Models\DocumentDownload;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<DocumentDownload>
 */
class DocumentDownloadFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'type' => fake()->randomElement(['invoice', 'receipt']),
            'ids' => [fake()->randomDigit()],
        ];
    }
}
