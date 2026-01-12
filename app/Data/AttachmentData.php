<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AttachmentData extends Data
{
    public function __construct(
        public readonly ?int $id,

        public readonly int $attachable_id,
        public readonly string $attachable_type,
        public readonly int $document_id,
        public readonly int $pos,

        public readonly ?int $days,
        public readonly ?float $amount,
        public readonly ?bool $is_currency_difference,
        public readonly DocumentData $document,
    ) {}
}
