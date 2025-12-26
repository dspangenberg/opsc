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
class DocumentData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly ?int $document_type_id,
        public readonly ?int $contact_id,
        public readonly ?int $project_id,
        public readonly string $filename,
        public readonly string $mime_type,
        public readonly int $file_size,
        public readonly int $pages,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $issued_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $sent_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:M')]
        public readonly ?DateTime $deleted_at,

        public readonly string $title,
        public readonly ?string $label,
        public readonly ?string $description,
        public readonly ?string $reference,
        public readonly bool $is_pinned,
        public readonly bool $is_confirmed,

        public readonly ?ContactData $contact,
        public readonly ?DocumentTypeData $type,
        public readonly ?ProjectData $project,
    ) {}
}
