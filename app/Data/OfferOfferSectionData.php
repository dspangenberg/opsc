<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use App\Enums\PagebreakEnum;
use DateTime;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OfferOfferSectionData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $offer_id,
        public readonly int $section_id,
        public readonly int $pos,
        public readonly ?string $title,
        public readonly ?string $content,
        public readonly ?PagebreakEnum $pagebreak,
    ) {
    }
}
