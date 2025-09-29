<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class InvoicingSettings extends Settings
{

    public static function group(): string
    {
        return 'invoicing';
    }
}
