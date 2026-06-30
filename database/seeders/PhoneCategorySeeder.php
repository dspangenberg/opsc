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
        if (PhoneCategory::count() > 0) {
            return;
        }

        $phoneCategories = Storage::disk('json')->json('phone_categories.json');
        foreach ($phoneCategories as $value) {
            PhoneCategory::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'type' => $value['type'],
                'created_at' => $value['created_at'],
                'updated_at' => $value['updated_at'],
            ]);
        }
    }
}
