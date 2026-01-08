<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.site_name', 'My Application');
        $this->migrator->add('general.company_name', 'My Company');
        $this->migrator->add('general.site_active', true);
        $this->migrator->add('general.default_currency', 'EUR');
        $this->migrator->add('general.default_language', 'de');
        $this->migrator->add('general.timezone', 'Europe/Berlin');
    }
};
