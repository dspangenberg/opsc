<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BookkeepingAccountData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $account_number,
        public readonly string $name,
        public readonly string $label,
        public readonly string $type,
        public readonly ?TaxData $tax

    ) {}
}
