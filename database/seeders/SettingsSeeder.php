<?php

namespace Database\Seeders;

use App\Settings\InvoiceReminderSettings;
use Illuminate\Database\Seeder;

class SettingsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Settings werden über die Migration initialisiert
        // Hier nur Tenant-spezifische Updates
        if (tenant()) {
            $settings = app(InvoiceReminderSettings::class);
            $settings->site_name = tenant()->organisation;
            $settings->company_name = tenant()->organisation;
            $settings->save();
        }
    }
}
