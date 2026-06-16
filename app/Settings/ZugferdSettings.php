<?php

namespace App\Settings;

use Spatie\LaravelSettings\Settings;

class ZugferdSettings extends Settings
{
    public string $global_id;

    public string $global_id_type;

    public string $seller;

    public string $seller_tax_vat;

    public string $seller_email;

    public string $document_note;

    public string $seller_contact_id;

    public string $payment_term;

    public static function group(): string
    {
        return 'zugferd';
    }
}
