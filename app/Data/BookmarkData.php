<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class BookmarkData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly string $name,
        public readonly string $route_name,
        public readonly array $route_params,
        public readonly bool $is_pinned,
        public readonly int $pos,
        public readonly string $model,
        public readonly string $sidebar_title,
        public readonly string $title,
    ) {}
}
