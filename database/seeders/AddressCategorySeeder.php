<?php

namespace Database\Seeders;

use App\Models\AddressCategory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class AddressCategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (AddressCategory::count() > 0) {
            return;
        }

        $titles = Storage::disk('json')->json('address_categories.json');
        foreach ($titles as $value) {
            AddressCategory::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'type' => $value['type'],
                'is_invoice_address' => $value['is_invoice_address'],
            ]);
        }
    }
}
