<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BookkeepingRuleActionData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $bookkeeping_rule_id,
        public readonly string $field,
        public readonly string $value,
    ) {}
}
