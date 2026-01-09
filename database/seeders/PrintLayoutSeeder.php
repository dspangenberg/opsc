<?php

namespace Database\Seeders;

use App\Models\Region;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class RegionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $titles = Storage::disk('json')->json('regions.json');
        foreach ($titles as $value) {
            Region::updateOrCreate([
                'id' => $value['id'],
            ], [
                'country_id' => $value['country_id'],
                'short_name' => $value['short_name'],
                'name' => $value['name'],
                'place_short_name' => $value['place_short_name'],
            ]);
        }
    }
}
