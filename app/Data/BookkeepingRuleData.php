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
class BookkeepingRuleData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly int $priority,
        public readonly bool $is_active,
        public readonly string $table,
        public readonly string $logical_operator,
        public readonly string $action_type,
        public readonly string $type,
        /** @var BookkeepingRuleConditionData[] */
        #[DataCollectionOf(BookkeepingRuleConditionData::class)]
        public readonly ?array $conditions,

        /** @var BookkeepingRuleActionData[] */
        #[DataCollectionOf(BookkeepingRuleActionData::class)]
        public readonly ?array $actions,

    ) {}
}
