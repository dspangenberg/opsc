<?php

use Spatie\LaravelSettings\Migrations\SettingsMigration;

return new class extends SettingsMigration
{
    public function up(): void
    {
        $this->migrator->add('invoice_reminders.level_1_subject', 'Zahlungserinnerung');
        $this->migrator->add('invoice_reminders.level_1_intro', '');
        $this->migrator->add('invoice_reminders.level_1_outro', '');
        $this->migrator->add('invoice_reminders.level_1_days', 7);
        $this->migrator->add('invoice_reminders.level_1_due_days', 7);
        $this->migrator->add('invoice_reminders.level_1_next_level_days', 10);

        $this->migrator->add('invoice_reminders.level_2_subject', 'Mahnung');
        $this->migrator->add('invoice_reminders.level_2_intro', '');
        $this->migrator->add('invoice_reminders.level_2_outro', '');
        $this->migrator->add('invoice_reminders.level_2_due_days', 7);
        $this->migrator->add('invoice_reminders.level_2_next_level_days', 10);

        $this->migrator->add('invoice_reminders.level_3_subject', '2. Mahnung');
        $this->migrator->add('invoice_reminders.level_3_intro', '');
        $this->migrator->add('invoice_reminders.level_3_outro', '');
        $this->migrator->add('invoice_reminders.level_3_due_days', 7);
    }
};
