<?php
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Carbon\CarbonInterface;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TenantData extends Data
{
    public function __construct(
        public readonly string $first_name,
        public readonly string $last_name,
        public readonly string $organisation,
        public readonly string $email,
        public readonly string $website,
        public readonly string $subdomain,
        public readonly string $prefix,
        public readonly string $formated_prefix
    ) {
    }
}
