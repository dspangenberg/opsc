<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DropboxData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $email_address,
        public readonly string $token,
        public readonly string $name,
        public readonly bool $is_shared,
        public readonly bool $is_auto_processing,
    ) {}
}
