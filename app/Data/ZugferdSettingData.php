<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class ZugferdSettingData extends Data
{
    public function __construct(
        public readonly ?bool $is_enabled,
        public readonly ?int $seller_contact_id,
        public readonly ?int $seller_contact_person_id,
        public readonly ?int $seller_contact_address_id,
        public readonly ?string $document_note,
        public readonly ?string $global_id_type,
        public readonly ?string $global_id,
    ) {}
}
