<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SimpleContactData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $reverse_full_name,
        public readonly string $initials,
        public readonly ?string $primary_mail,
    ) {}

    public function defaultWrap(): string
    {
        return 'data';
    }
}
