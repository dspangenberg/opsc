<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use DateTime;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ContactData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly ?string $first_name,
        public readonly ?string $company_name,
        public readonly ?int $company_id,
        public readonly string $full_name,
        public readonly string $reverse_full_name,
        public readonly string $initials,
        public readonly ?int $title_id,
        public readonly ?int $salutation_id,
        public readonly ?string $creditor_number,
        public readonly ?string $note,
        public readonly ?bool $is_favorite,
        public readonly ?bool $is_org,
        public readonly ?string $debtor_number,
        public readonly ?string $primary_mail,
        public readonly ?string $vat_id,
        public readonly ?string $short_name,
        public readonly ?string $register_court,
        public readonly ?string $register_number,
        public readonly ?string $department,
        public readonly ?string $position,
        public readonly ?string $tax_number,
        public readonly ?string $formated_debtor_number,
        public readonly ?string $formated_creditor_number,
        public readonly ?int $payment_deadline_id,
        public readonly ?int $tax_id,
        public readonly ?string $iban,
        public readonly ?string $paypal_email,
        public readonly ?string $cc_name,
        public readonly ?int $outturn_account_id,
        public readonly ?string $website,
        public readonly ?bool $is_primary,
        public readonly ?bool $is_debtor,
        public readonly ?bool $is_archived,
        public readonly ?bool $is_creditor,
        public readonly ?string $primary_phone,
        public readonly ?int $cost_center_id,
        public readonly ?CostCenterData $cost_center,
        public ?string $avatar_url,

        /** @var BookkeepingAccountData */
        public readonly ?object $outturn_account,

        public readonly ?CompanyData $company,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $dob,

        /** @var ContactData[] */
        public readonly ?array $contacts,

        /** @var TitleData */
        public readonly ?object $title,

        /** @var SalutationData */
        public readonly ?object $salutation,

        /** @var PaymentDeadlineData */
        public readonly ?object $payment_deadline,

        /** @var TaxData */
        public readonly ?object $tax,

        /** @var ContactMailData[] */
        public readonly ?array $mails,

        /** @var ContactPhoneData[] */
        public readonly ?array $phones,

        /** @var SalesData */
        public readonly ?SalesData $sales,

        /** @var ContactAddressData[] */
        public readonly ?array $addresses,

        /** @var NoteableData[] */
        public readonly ?array $notables
    ) {}

    public function defaultWrap(): string
    {
        return 'data';
    }
}
