<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use DateTime;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BookkeepingBookingData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $account_id_credit,
        public readonly int $account_id_debit,
        public readonly float $amount,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $date,

        public readonly int $tax_id,
        public readonly bool $is_split,
        public readonly int $split_id,
        public readonly string $booking_text,
        public readonly ?string $note,
        public readonly float $tax_credit,
        public readonly float $tax_debit,
        public readonly bool $is_locked,
        public readonly bool $is_marked,
        public readonly string $bookable_type,
        public readonly int $bookable_id,
        public readonly int $number_range_document_numbers_id,
        public readonly ?string $document_number,
        public readonly ?string $created_at,
        public readonly ?string $updated_at,
        public readonly bool $is_canceled,
        public readonly int $canceled_id,

        public readonly ?float $balance,
        public readonly ?string $balance_type,
        public readonly ?int $counter_account,
        public readonly ?string $counter_account_label,
        public readonly ?float $amount_net,

        /** @var BookkeepingAccountData */
        public readonly ?object $account_credit,
        /** @var BookkeepingAccountData */
        public readonly ?object $account_debit,
        /** @var TaxData */
        public readonly ?object $tax,

    ) {}
}
