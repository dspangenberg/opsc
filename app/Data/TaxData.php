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
class TaxData extends Data
{
    public function __construct(
        public readonly ?int $id,

        public readonly string $name,
        public readonly string $invoice_text,
        public readonly bool $needs_vat_id,
        public readonly bool $is_default,

        /** @var TaxRateData[] */
        public readonly ?array $rates,
    ) {
    }

    public function defaultWrap(): string
    {
        return 'data';
    }
}
