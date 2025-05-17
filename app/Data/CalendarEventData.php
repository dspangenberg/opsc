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
class CalendarEventData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $title,
        public readonly string $description,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly DateTime $start_at,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly DateTime $end_at,
        public readonly string $color,
        public readonly int $calendar_id,
        public readonly ?int $accommodation_id
    ) {}
}
