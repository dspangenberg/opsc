<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class TenantSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            AddressCategorySeeder::class,
            CountrySeeder::class,
            DocumentTypeSeeder::class,
            InvoiceTypeSeeder::class,
            PrintLayoutSeeder::class,
            PaymentDeadlineSeeder::class,
            PhoneCategorySeeder::class,
            ProjectCategorySeeder::class,
            SalutationSeeder::class,
            SettingsSeeder::class,
            TaxSeeder::class,
            TaxRateSeeder::class,
            TimeCategorySeeder::class,
            TitleSeeder::class,
        ]);
    }
}
