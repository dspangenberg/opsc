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

    public int $seller_contact_id;

    public int $seller_contact_person_id;
    public int $seller_contact_address_id,

    public string $seller_address_line_1;

    public string $seller_address_line_2;

    public string $seller_address_line_3;

    public string $seller_zip;

    public string $seller_city;

    public string $seller_country_iso;

    public string $payment_term;

    public static function group(): string
    {
        return 'zugferd';
    }
}
