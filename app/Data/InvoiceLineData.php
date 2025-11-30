<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use DateTime;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class InvoiceLineData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $invoice_id,
        public readonly int $type_id,
        public readonly int $pos,
        public readonly int $tax_id,
        public readonly ?float $quantity,
        public readonly ?string $unit,
        public readonly string $text,
        public readonly ?float $price,
        public readonly ?float $amount,
        public readonly ?float $tax,
        public readonly float $tax_rate_id,

        public readonly ?TaxRateData $rate,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $service_period_begin,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $service_period_end,

        /** @var InvoiceData */
        public readonly ?InvoiceData $linked_invoice,

    ) {
    }
}
