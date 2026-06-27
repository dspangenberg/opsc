<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Data;

use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
class DropboxMailAttachmentData extends Data
{
    public function __construct(
        public readonly string $id,
        public readonly string $dropbox_mail_id,
        public readonly string $filename,
        public readonly ?string $mime_type,
        public readonly int $size,
    ) {}
}
