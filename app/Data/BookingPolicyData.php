<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BookingPolicyData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly bool $is_default,
        public readonly ?int $age_min,
        public readonly ?array $arrival_days,
        public readonly ?array $departure_days,
        public readonly ?int $stay_min,
        public readonly ?int $stay_max,
        public readonly ?string $checkin,
        public readonly ?string $checkout,
    ) {}
}
