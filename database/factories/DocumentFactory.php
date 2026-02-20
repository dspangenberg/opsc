<?php

namespace Database\Factories;

use App\Models\Document;
use App\Models\DocumentType;
use Illuminate\Database\Eloquent\Factories\Factory;

class DocumentFactory extends Factory
{
    protected $model = Document::class;

    public function definition(): array
    {
        return [
            'document_type_id' => DocumentType::factory(),
            'filename' => $this->faker->word.'.pdf',
            'source_file' => $this->faker->word.'.pdf',
            'issued_on' => $this->faker->date(),
            'received_on' => $this->faker->date(),
            'fulltext' => $this->faker->paragraph(3),
            'summary' => $this->faker->sentence(),
            'is_confirmed' => true,
            'is_pinned' => false,
            'is_hidden' => false,
            'is_inbound' => true,
        ];
    }

    public function unconfirmed(): Factory
    {
        return $this->state([
            'is_confirmed' => false,
        ]);
    }

    public function pinned(): Factory
    {
        return $this->state([
            'is_pinned' => true,
        ]);
    }

    public function withTitle(string $title): Factory
    {
        return $this->state([
            'title' => $title,
        ]);
    }
}
