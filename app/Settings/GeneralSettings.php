<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class GeneralSettings extends Settings
{
    public string $site_name;

    public string $company_name;

    public bool $site_active;

    public string $default_currency;

    public string $default_language;

    public string $timezone;

    public ?string $pdf_global_css;

    public static function group(): string
    {
        return 'general';
    }
}
