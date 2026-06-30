<?php

namespace Database\Seeders;

use App\Models\ProjectCategory;
use App\Models\TimeCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TimeCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (TimeCategory::count() > 0) {
            return;
        }

        $timeCategories = Storage::disk('json')->json('time_categories.json');
        foreach ($timeCategories as $value) {
            TimeCategory::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'short_name' => $value['short_name'],
                'pos' => $value['pos'],
                'is_default' => $value['is_default'],
                'hourly' => $value['hourly'],
                'created_at' => $value['created_at'],
                'updated_at' => $value['updated_at'],
            ]);
        }
    }
}
