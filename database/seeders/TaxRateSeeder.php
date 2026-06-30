<?php

namespace Database\Seeders;

use App\Models\TaxRate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TaxRateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (TaxRate::count() > 0) {
            return;
        }

        $tax_rates = Storage::disk('json')->json('tax_rates.json');
        foreach ($tax_rates as $value) {
            TaxRate::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'tax_id' => $value['tax_id'],
                'rate' => $value['rate'],
                'outturn_account_id' => $value['outturn_account_id'],
            ]);
        }
    }
}
