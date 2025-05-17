<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use MatanYadaev\EloquentSpatial\Objects\Point;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class AccommodationData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly int $type_id,
        public readonly string $place_id,
        public readonly string $name,
        public readonly string $street,
        public readonly string $zip,
        public readonly string $city,
        public readonly ?Point $coordinates,
        public readonly int $country_id,
        public readonly int $region_id,
        public readonly ?float $latitude,
        public readonly ?float $longitude,
        public readonly string $website,
        public readonly string $phone,
        public readonly string $email,
    ) {}
}
