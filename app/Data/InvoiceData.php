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
        public readonly ?int $id,

        public readonly int $contact_id,
        public readonly int $project_id,
        public readonly int $invoice_contact_id,

        public readonly int $type_id,
        public readonly ?int $invoice_number,

        public readonly int $payment_deadline_id,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $issued_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $due_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $service_period_begin,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $service_period_end,

        public readonly bool $dunning_block,
        public readonly bool $is_draft,
        public readonly bool $is_loss_of_receivables,

        public readonly ?string $service_provision,
        public readonly ?string $vat_id,
        public readonly ?string $address,
        public readonly ?string $filename,

        public readonly ?BookkeepingBookingData $booking,

        public readonly array $invoice_address,
        public readonly string $formated_invoice_number,

        public readonly float $amount_net,
        public readonly float $amount_tax,
        public readonly float $amount_gross,
        public readonly ?float $payable_sum_amount,
        public readonly ?float $amount_open,

        public readonly bool $is_recurring,
        public readonly int $recurring_interval_days,
        public readonly ?string $additional_text,

        public readonly ?int $parent_id,
        public readonly ?int $tax_id,

        /** @var InvoiceData */
        public readonly ?object $parent_invoice,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $sent_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $recurring_begin_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $recurring_end_on,

        /** @var InvoiceTypeData */
        public readonly ?object $type,

        /** @var ContactData */
        public readonly ?object $contact,

        /** @var ContactData */
        public readonly ?object $invoice_contact,

        /** @var ProjectData */
        public readonly ?object $project,

        /** @var PaymentDeadlineData */
        public readonly ?object $payment_deadline,

        /** @var InvoiceLineData[] */
        public readonly ?array $lines,

        /** @var TaxData */
        public readonly ?object $tax,

    ) {
    }

    public function defaultWrap(): string
    {
        return 'data';
    }
}
