<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Carbon\CarbonInterface;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AccommodationTypeData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $description,
        public readonly string $title,
    ) {
    }
}
