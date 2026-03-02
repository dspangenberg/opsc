<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SendEmailData extends Data
{
    public function __construct(
        public readonly string $email,
        public readonly string $name,
        public readonly string $city,
        public readonly string $body,
        public readonly string $subject,
        public readonly int $email_account_id,
    ) {}
}
