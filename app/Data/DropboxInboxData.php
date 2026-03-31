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
class DropboxInboxData extends Data
{
    public function __construct(
        public readonly int $id,
        public readonly int $dropbox_id,
        public readonly string $from,

        /** @var string[] */
        public readonly array $to,

        public readonly DropboxData $dropbox,

        public readonly string $subject,
        public readonly string $plain_body,
        public readonly array $payload,
        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $date,
    ) {}
}
