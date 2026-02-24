<?php

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
