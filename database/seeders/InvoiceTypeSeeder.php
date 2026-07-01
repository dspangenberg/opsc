<?php

namespace Database\Seeders;

use App\Models\InvoiceType;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class InvoiceTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $invoiceTypes = Storage::disk('json')->json('invoice_types.json');
        foreach ($invoiceTypes as $value) {
            InvoiceType::firstOrCreate([
                'id' => $value['id'],
            ], [
                'print_name' => $value['print_name'],
                'display_name' => $value['display_name'],
                'abbreviation' => $value['abbreviation'],
                'zugferd_id' => $value['zugferd_id'],
                'key' => $value['key'],
                'is_default' => $value['is_default'],

            ]);
        }
    }
}
