<?php

namespace Database\Seeders;

use App\Models\AccommodationType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class AccommodationTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $titles = Storage::disk('json')->json('accommodation_types.json');
        foreach ($titles as $value) {
            AccommodationType::updateOrCreate([
                'id' => $value['id'],
            ], [
                'title' => $value['title'],
                'description' => $value['description'],
                'code' => $value['code'],
                'is_from_system_catalog' => $value['is_from_system_catalog'],
            ]);
        }
    }
}
