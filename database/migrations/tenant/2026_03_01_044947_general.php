<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('general.logo_url', '');
        $this->migrator->add('general.logo_class', '');
    }

    public function down(): void {
        $this->migrator->delete('general.logo_url');
        $this->migrator->delete('general.logo_class');
    }
};
