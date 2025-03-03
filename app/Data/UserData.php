<?php
/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Carbon\CarbonInterface;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class UserData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $first_name,
        public readonly string $last_name,
        public readonly ?string $avatar_url,
        public readonly bool $is_admin,
        public readonly string $email,
        public readonly string $full_name,
        public readonly string $reverse_full_name,
        public readonly string $initials,
        public readonly ?string $user_agent,
        public readonly ?CarbonInterface $email_verified_at,
    ) {
    }
}
