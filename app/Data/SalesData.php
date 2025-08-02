<?php

namespace App\Data;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;
use Spatie\LaravelData\Data;

#[TypeScript]
class SalesData extends Data
{
    public function __construct(
        public readonly float $currentYear,
        public readonly float $allTime,
    ) {}
}
