<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ContactAddressData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $contact_id,
        public readonly string $address,
        public readonly string $zip,
        public readonly string $city,
        public readonly int $country_id,
        public readonly array $full_address,
        public int $address_category_id,
        /** @var AddressCategoryData */
        public readonly ?object $category,
        /** @var CountryData */
        public readonly ?object $country,
    ) {}
}
