<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('zugferd.seller_address_line_1', '');
        $this->migrator->add('zugferd.seller_address_line_2', '');
        $this->migrator->add('zugferd.seller_address_line_3', '');
        $this->migrator->add('zugferd.seller_zip', '');
        $this->migrator->add('zugferd.seller_city', '');
        $this->migrator->add('zugferd.seller_country_iso', '');
    }
};
