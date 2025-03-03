<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class RegionData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $country_id,
        public readonly string $name,
        public readonly string $short_name,
        public readonly string $place_short_name,
    ) {
    }
}
