<?php

namespace Database\Seeders;

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
        $timeCategories = Storage::disk('json')->json('time_categories.json');
        foreach ($timeCategories as $value) {
            TimeCategory::firstOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'short_name' => $value['short_name'],
                'pos' => $value['pos'],
                'is_default' => $value['is_default'],
                'hourly' => $value['hourly'],
            ]);
        }
    }
}
