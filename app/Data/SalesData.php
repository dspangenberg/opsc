<?php

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SalesData extends Data
{
    public function __construct(
        public readonly float $currentYear,
        public readonly float $allTime,
    ) {}
}
