<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use DateTime;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class PaymentData extends Data
{
    public function __construct(
        public readonly ?int $id,

        public readonly string $payable_type,
        public readonly int $payable_id,
        public readonly ?int $days,
        public readonly ?float $amount,
        public readonly ?bool $is_currency_difference,
        public readonly int $transaction_id,
        public readonly TransactionData $transaction,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $issued_on,
    ) {}
}
