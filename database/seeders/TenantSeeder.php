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
            PrintLayoutSeeder::class,
            SalutationSeeder::class,
            TitleSeeder::class,
            SettingsSeeder::class,
            TaxSeeder::class,
            TaxRateSeeder::class,
        ]);
    }
}
