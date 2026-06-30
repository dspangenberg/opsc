<?php

namespace Database\Seeders;

use App\Models\PaymentDeadline;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class PaymentDeadlineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (PaymentDeadline::count() > 0) {
            return;
        }

        $paymentDeadlines = Storage::disk('json')->json('payment_deadlines.json');
        foreach ($paymentDeadlines as $value) {
            PaymentDeadline::updateOrCreate([
                'id' => $value['id'],
            ], [
                'name' => $value['name'],
                'days' => $value['days'],
                'is_immediately' => $value['is_immediately'],
                'is_default' => $value['is_default'],
                'invoice_text' => $value['invoice_text'],
            ]);
        }
    }
}
