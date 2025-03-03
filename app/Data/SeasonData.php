<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SeasonData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly bool $is_default,
        public readonly ?string $color,
        public readonly int $booking_mode,
        public readonly bool $has_season_related_restrictions,
        /** @var SeasonPeriodData[] */
        public readonly ?array $periods,
    ) {
    }
}
