<?php

namespace Database\Seeders;

use App\Settings\GeneralSettings;
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
            $settings = app(GeneralSettings::class);
            $settings->site_name = tenant()->organisation;
            $settings->company_name = tenant()->organisation;
            $settings->invoice_logo = 'false'; // Ja, CodeRabbit das ist beabsichtigt, da wir in Settings noch keine Booleans speichern können.
            $settings->save();
        }
    }
}
