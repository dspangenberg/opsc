<?php

namespace Database\Seeders;

use App\Models\ProjectCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProjectCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $projectCategories = Storage::disk('json')->json('project_categories.json');
        foreach ($projectCategories as $value) {
            ProjectCategory::firstOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'color' => $value['color'],
                'icon' => $value['icon'],
            ]);
        }
    }
}
