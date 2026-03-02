<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use App\Enums\InvoiceRecurringEnum;
use DateTime;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ParentInvoiceData extends Data
{
    public function __construct(
        public readonly ?int $id,

        public readonly int $invoice_number,
        public readonly string $formated_invoice_number,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $issued_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $sent_at,

    ) {}

    public function defaultWrap(): string
    {
        return 'data';
    }
}
