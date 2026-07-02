<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->rename('zugferd.seller_contact_addres_id', 'zugferd.seller_contact_address_id');
    }
};
