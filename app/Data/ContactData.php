<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ContactData extends Data
{
    public function __construct(
        public readonly ?int    $id,
        public readonly string  $name,
        public readonly ?string $first_name,
        public readonly ?string $company_name,
        public readonly ?int    $company_id,
        public readonly string  $full_name,
        public readonly string  $reverse_full_name,
        public readonly string  $initials,
        public readonly ?int    $title_id,
        public readonly ?int    $salutation_id,
        public readonly ?string $creditor_number,
        public readonly ?bool   $is_favorite,
        public readonly ?string $debtor_number,
        public readonly ?string $primary_mail,
        public readonly ?string $vat_id,
        public readonly ?string $register_court,
        public readonly ?string $register_number,
        public readonly ?string $tax_number,

        /** @var ContactData */
        public readonly ?object $company,
        /** @var TitleData */
        public readonly ?object $title,
        /** @var SalutationData */
        public readonly ?object $salutation,
        /** @var ContactMailData[] */
        public readonly ?array  $emails,
    )
    {
    }

    public function defaultWrap(): string
    {
        return 'data';
    }
}
