<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use App\Models\NumberRangeDocumentNumber;
use Spatie\LaravelData\Attributes\WithTransformer;
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
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $issued_on,

        public readonly string $org_filename,
        public readonly float $file_size,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i:s')]
        public readonly DateTime $file_created_at,

        public readonly ?int $contact_id,
        public readonly ?int $cost_center_id,
        public readonly ?int $bookkeeping_account_id,

        public readonly ?string $org_currency,
        public readonly ?float $org_amount,
        public readonly ?float $amount,
        public readonly ?float $exchange_rate,
        public readonly ?string $document_number,

        public readonly ?string $iban,
        public readonly ?int $number_range_document_number_id,
        public readonly ?BookkeepingAccountData $account,
        public readonly ?ContactData $contact,
        public readonly ?CostCenterData $cost_center,
        public readonly ?NumberRangeDocumentNumber $number_range_document_number,
        public readonly string $checksum,
        public readonly ?string $text,
        public readonly ?array $data,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i:s')]
        public readonly DateTime $created_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i:s')]
        public readonly DateTime $updated_at,

    ) {}
}
