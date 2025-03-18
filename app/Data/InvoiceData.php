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
class InvoiceData extends Data
{
    public function __construct(
        public readonly ?int      $id,

        public readonly int       $contact_id,
        public readonly int       $project_id,
        public readonly int       $invoice_contact_id,

        public readonly int       $type_id,
        public readonly int       $invoice_number,

        public readonly int       $payment_deadline_id,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime  $issued_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $due_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $service_period_begin,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $service_period_end,

        public readonly bool      $dunning_block,
        public readonly bool      $is_draft,

        public readonly ?string   $service_provision,
        public readonly ?string   $vat_id,
        public readonly ?string   $address,

        /** @var string */
        public readonly array     $invoice_address,
        public readonly string    $formated_invoice_number,

        public readonly float     $amount_net,
        public readonly float     $amount_tax,
        public readonly float     $amount_gross,

        /** @var InvoiceTypeData */
        public readonly ?object   $type,

        /** @var ContactData */
        public readonly ?object   $contact,

        /** @var ContactData */
        public readonly ?object   $invoice_contact,

        /** @var ProjectData */
        public readonly ?object   $project,

        /** @var PaymentDeadlineData */
        public readonly ?object   $payment_deadline,

        /** @var InvoiceLineData[] */
        public readonly ?array    $lines,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $sent_at,
    )
    {
    }

    public function defaultWrap(): string
    {
        return 'data';
    }
}
