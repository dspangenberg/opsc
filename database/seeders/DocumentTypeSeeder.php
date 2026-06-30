<?php

namespace Database\Seeders;

use App\Models\DocumentType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class DocumentTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (DocumentType::count() > 0) {
            return;
        }

        $documentTypes = Storage::disk('json')->json('document_types.json');
        foreach ($documentTypes as $value) {
            DocumentType::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'parent_id' => $value['parent_id'],
                'color' => $value['color'],
                'icon' => $value['icon'],
                'created_at' => $value['created_at'],
                'updated_at' => $value['updated_at'],
            ]);
        }
    }
}
