<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BankAccountData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?string $name,
        public readonly ?string $iban,
        public readonly ?string $bic,
        public readonly ?string $prefix,
        public readonly ?string $email,
        public readonly ?string $bank_name,
        public readonly ?string $account_owner,
        public readonly ?int $bookkeeping_account_id,
        public readonly ?int $pos,
        public readonly ?bool $is_default,
        public readonly ?bool $is_paypal,
        public readonly ?bool $is_closed,
    ) {}
}
