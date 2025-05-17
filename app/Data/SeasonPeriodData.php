<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use DateTime;
use Spatie\LaravelData\Attributes\WithTransformer;
use Spatie\LaravelData\Data;
use Spatie\LaravelData\Transformers\DateTimeInterfaceTransformer;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class SeasonPeriodData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $season_id,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $begin_on,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $end_on,
    ) {}
}
