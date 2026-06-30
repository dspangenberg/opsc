<?php

namespace Database\Seeders;

use App\Models\Letterhead;
use App\Models\PrintLayout;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PrintLayoutSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $letterheads = Storage::disk('json')->json('letterheads.json');
        foreach ($letterheads as $value) {
            Letterhead::firstOrCreate([
                'id' => $value['id'],
            ], [
                'title' => $value['title'],
                'css' => $value['css'],
                'is_multi' => $value['is_multi'],
                'is_default' => $value['is_default'],
            ]);
        }

        $letterhead = Letterhead::first();

        $print_layouts = Storage::disk('json')->json('print_layouts.json');
        foreach ($print_layouts as $value) {
            PrintLayout::firstOrCreate([
                'id' => $value['id'],
            ], [
                'title' => $value['title'],
                'name' => $value['name'],
                'css' => $value['css'],
                'letterhead_id' => $letterhead->id,
            ]);
        }
    }
}
