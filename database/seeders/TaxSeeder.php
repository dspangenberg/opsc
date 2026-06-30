<?php

namespace Database\Seeders;

use App\Models\Tax;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class TaxSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (Tax::count() > 0) {
            return;
        }

        $taxes = Storage::disk('json')->json('taxes.json');
        foreach ($taxes as $value) {
            Tax::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'invoice_text' => $value['invoice_text'],
                'needs_vat_id' => $value['needs_vat_id'],
                'value' => $value['value'],
                'is_default' => $value['is_default'],
                'account_input_tax' => $value['account_input_tax'],
                'account_vat' => $value['account_vat'],
                'tax_code_number' => $value['tax_code_number'],
                'is_bidirectional' => $value['is_bidirectional'],
                'legacy_id' => $value['legacy_id'],
                'outturn_account_id' => $value['outturn_account_id'],
                'default_rate_id' => $value['default_rate_id'],
            ]);
        }
    }
}
