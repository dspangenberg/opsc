<?php

namespace Database\Seeders;

use App\Models\Title;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TitleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $titles = Storage::disk('json')->json('titles.json');
        foreach ($titles as $value) {
            Title::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'correspondence_salutation_male' => $value['correspondence_salutation_male'],
                'correspondence_salutation_female' => $value['correspondence_salutation_female'],
                'correspondence_salutation_other' => $value['correspondence_salutation_other'],
            ]);
        }
    }
}
