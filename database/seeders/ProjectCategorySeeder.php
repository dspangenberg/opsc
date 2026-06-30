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
        if (ProjectCategory::count() > 0) {
            return;
        }

        $projectCategories = Storage::disk('json')->json('project_categories.json');
        foreach ($projectCategories as $value) {
            ProjectCategory::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'color' => $value['color'],
                'icon' => $value['icon'],
                'created_at' => $value['created_at'],
                'updated_at' => $value['updated_at'],
            ]);
        }
    }
}
