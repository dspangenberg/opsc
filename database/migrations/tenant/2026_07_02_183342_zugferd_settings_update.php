<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {

        $this->migrator->add('zugferd.seller_contact_person_id', 0);
        $this->migrator->add('zugferd.seller_contact_address_id', 0);
        $this->migrator->add('zugferd.is_enabled', false);

        /*
        $this->migrator->delete('zugferd.seller_tax_vat');
        $this->migrator->delete('zugferd.seller_email');
        $this->migrator->delete('zugferd.seller_address_line_1');
        $this->migrator->delete('zugferd.seller_address_line_2');
        $this->migrator->delete('zugferd.seller_address_line_3');
        $this->migrator->delete('zugferd.seller_zip');
        $this->migrator->delete('zugferd.seller_city');
        $this->migrator->delete('zugferd.seller_country_iso');
        */

    }
};
