<?php

namespace Database\Seeders;

use App\Models\PhoneCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PhoneCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $phoneCategories = Storage::disk('json')->json('phone_categories.json');
        foreach ($phoneCategories as $value) {
            PhoneCategory::firstOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'type' => $value['type'],
            ]);
        }
    }
}
