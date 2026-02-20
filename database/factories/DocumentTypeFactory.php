<?php

namespace Database\Factories;

use App\Models\DocumentType;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentTypeFactory extends Factory
{
    protected $model = DocumentType::class;

    public function definition(): array
    {
        return [
            'parent_id' => 0,
            'name' => $this->faker->word.' Document Type',
            'color' => $this->faker->hexColor,
            'icon' => $this->faker->randomElement(['file-pdf', 'file-word', 'file-excel', 'file-image']),
        ];
    }
}
