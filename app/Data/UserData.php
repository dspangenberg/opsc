<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Carbon\CarbonInterface;
use DateTime;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
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
        public readonly bool $is_locked,
        public readonly string $email,
        public readonly string $full_name,
        public readonly string $reverse_full_name,
        public readonly string $initials,
        public readonly ?string $user_agent,
        public readonly ?string $pendingEmail,
        public readonly ?bool $is_impersonating,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $last_login_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $email_verified_at,
    ) {}
}
