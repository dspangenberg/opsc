<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class MailSettings extends Settings
{
  public string $smtp_host;

  public string $smtp_port;

  public string $cc;

  public string $smtp_encryption;

  public string $imprint;

  public string $signature;

  public static function group(): string
  {
    return 'mail';
  }
}
