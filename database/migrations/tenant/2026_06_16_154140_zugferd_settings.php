<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('zugferd.global_id', '');
        $this->migrator->add('zugferd.global_id_type', '0060');
        $this->migrator->add('zugferd.seller', '');
        $this->migrator->add('zugferd.seller_contact_id', '');
        $this->migrator->add('zugferd.seller_tax_vat', '');
        $this->migrator->add('zugferd.seller_email', '');
        $this->migrator->add('zugferd.document_note', '');
        $this->migrator->add('zugferd.payment_term', 'Der Rechnungsbetrag ist ohne Abzug sofort zahlbar.');
    }
};
