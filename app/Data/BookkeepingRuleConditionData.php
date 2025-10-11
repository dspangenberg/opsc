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
class BookkeepingRuleConditionData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $bookkeeping_rule_id,
        public readonly string $field,
        public readonly string $logical_condition,
        public readonly string $value,
    ) {}
}
