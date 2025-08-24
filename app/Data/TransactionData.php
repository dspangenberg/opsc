<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Carbon\Carbon;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class TransactionData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $mm_ref,
        public readonly int $contact_id,
        public readonly int $bank_account_id,
        public readonly Carbon $valued_on,
        public readonly ?Carbon $booked_on,
        public readonly ?string $comment,
        public readonly string $currency,
        public readonly ?string $booking_key,
        public readonly ?string $bank_code,
        public readonly ?string $account_number,
        public readonly string $name,
        public readonly ?string $purpose,
        public readonly float $amount,
        public readonly bool $is_private,
        public readonly ?Carbon $created_at,
        public readonly ?Carbon $updated_at,
        public readonly string $prefix,
        public readonly ?string $booking_text,
        public readonly ?string $type,
        public readonly ?string $return_reason,
        public readonly ?string $transaction_code,
        public readonly ?string $end_to_end_reference,
        public readonly ?string $mandate_reference,
        public readonly ?string $batch_reference,
        public readonly ?string $primanota_number,
        public readonly bool $is_transit,
        public readonly ?int $booking_id,
        public readonly ?string $org_category,
        public readonly float $amount_in_foreign_currency,
        public readonly ?int $number_range_document_numbers_id,
        public readonly ?string $foreign_currency,
        public readonly int $counter_account_id,
        public readonly bool $is_locked,
        public readonly bool $bookkeeping_text,
    ) {}
}
