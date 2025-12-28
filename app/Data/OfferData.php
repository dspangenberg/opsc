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
class OfferData extends Data
{
    public function __construct(
        public readonly ?int $id,

        public readonly int $contact_id,
        public readonly int $project_id,

        public readonly ?int $offer_number,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $issued_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $valid_until,

        public readonly bool $is_draft,
        public readonly ?string $filename,

        public readonly string $formated_offer_number,

        public readonly float $amount_net,
        public readonly float $amount_tax,
        public readonly float $amount_gross,

        public readonly ?string $additional_text,
        public readonly ?int $parent_id,
        public readonly ?int $tax_id,
        public readonly ?string $address,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $sent_at,

        public readonly ?DateTime $recurring_end_on,

        /** @var ContactData */
        public readonly ?object $contact,

        /** @var ProjectData */
        public readonly ?object $project,


        /** @var OfferLineData[] */
        public readonly ?array $lines,

        /** @var TaxData */
        public readonly ?object $tax,

    ) {
    }

    public function defaultWrap(): string
    {
        return 'data';
    }
}
