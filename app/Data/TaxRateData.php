<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TaxRateData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $tax_id,
        public readonly float $rate,
        public readonly string $name,
    ) {
    }

    public function defaultWrap(): string
    {
        return 'data';
    }
}
