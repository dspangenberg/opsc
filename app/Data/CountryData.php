<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class CountryData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $iso_code,
        public readonly string $vehicle_code,
        public readonly string $country_code,
    ) {
    }
}
