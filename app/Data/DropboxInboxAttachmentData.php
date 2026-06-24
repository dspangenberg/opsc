<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DropboxInboxAttachmentData extends Data
{
    public function __construct(
        public readonly string $filename,
        public readonly string $contentType,
        public readonly string $contentDisposition,
        public readonly ?string $contentId,
        public readonly string|array $content,
        public readonly int $size,
    ) {}
}
