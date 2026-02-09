<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use App\Models\NumberRangeDocumentNumber;
use Spatie\LaravelData\Attributes\WithCast;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Casts\DateTimeInterfaceCast;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use DateTime;
#[TypeScript]
class ReceiptData extends Data
{
    public function __construct(

        public readonly ?int $id,
        public readonly string $reference,
        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d')]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $issued_on,

        public readonly string $org_filename,
        public readonly float $file_size,

        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d H:i:s')]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i:s')]
        public readonly DateTime $file_created_at,
        public readonly float $open_amount,

        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d')]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $payable_min_issued_on,
        public readonly ?int $contact_id,
        public readonly ?int $cost_center_id,
        public readonly ?int $bookkeeping_account_id,

        public readonly ?string $org_currency,
        public readonly ?float $org_amount,
        public readonly float $amount,
        public readonly ?float $exchange_rate,
        public readonly ?string $document_number,
        public readonly ?int $duplicate_of,
        public readonly ?bool $is_foreign_currency,
        public readonly ?bool $is_confirmed,
        public readonly bool $is_locked,

        public readonly ?int $bookings_count,

        public readonly ?string $iban,
        public readonly ?int $number_range_document_number_id,
        public readonly ?BookkeepingAccountData $account,
        public readonly ?ContactData $contact,
        public readonly ?CostCenterData $cost_center,
        public readonly ?NumberRangeDocumentNumber $number_range_document_number,
        public readonly string $checksum,
        public readonly ?string $text,
        public readonly ?array $data,

        public readonly ?float $payable_sum,

        /** @var PaymentData[] */
        public readonly ?array $payable,

        /** @var BookkeepingBookingData[] */
        public readonly ?array $bookings,

        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d H:i:s')]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i:s')]
        public readonly DateTime $created_at,

        #[WithCast(DateTimeInterfaceCast::class, format: 'Y-m-d H:i:s')]
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i:s')]
        public readonly DateTime $updated_at,

    ) {}
}
