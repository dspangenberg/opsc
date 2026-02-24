<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class InvoiceReminderSettings extends Settings
{
    public string $level_1_subject;
    public string $level_1_intro;
    public string $level_1_outro;
    public int $level_1_days;

    public int $level_1_due_days;

    public int $level_1_next_level_days;

    public string $level_2_subject;
    public string $level_2_intro;
    public string $level_2_outro;

    public int $level_2_due_days;
    public int $level_2_next_level_days;

    public string $level_3_subject;
    public string $level_3_intro;
    public string $level_3_outro;
    
    public int $level_3_due_days;

    public static function group(): string
    {
        return 'invoice_reminders';
    }
}
