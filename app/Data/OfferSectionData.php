<?php

namespace App\Data;

use App\Enums\PagebreakEnum;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class OfferSectionData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,
        public readonly ?string $default_content,
        public readonly ?PagebreakEnum $pagebreak,
    ) {
    }
}
