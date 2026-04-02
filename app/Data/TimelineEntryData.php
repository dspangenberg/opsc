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
class TimelineEntryData extends Data
{
    public function __construct(
        public readonly string $type,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $date,

        public readonly ?NoteableData $note = null,
        public readonly ?DropboxMailData $mail = null,
    ) {}
}
