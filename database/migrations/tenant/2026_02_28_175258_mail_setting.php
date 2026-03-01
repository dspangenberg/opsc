<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('mail.smtp_host', '');
        $this->migrator->add('mail.smtp_port', '');
        $this->migrator->add('mail.smtp_encryption', 'tls');
        $this->migrator->add('mail.imprint', '');
        $this->migrator->add('mail.signature', '');
    }
};
