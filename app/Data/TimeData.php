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
class TimeData extends Data
{
    public function __construct(
        public readonly ?int $id,

        public readonly int $project_id,
        public readonly int $time_category_id,
        public readonly ?int $subproject_id,
        public readonly ?int $task_id,
        public readonly ?int $invoice_id,
        public readonly int $user_id,

        public readonly ?string $note,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly DateTime $begin_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $end_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly DateTime $date,

        public readonly bool $is_locked,
        public readonly bool $is_billable,
        public readonly bool $is_timer,

        public readonly ?int $minutes,
        public readonly ?int $mins,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $ping_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $created_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $updated_at,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y H:i')]
        public readonly ?DateTime $deleted_at,

        /** @var ProjectData */
        public readonly ?object $project,

        /** @var ProjectData */
        public readonly ?object $subproject,

        /** @var TimeCategoryData */
        public readonly ?object $category,

        /** @var UserData */
        public readonly ?object $user,
    ) {}

    public function defaultWrap(): string
    {
        return 'data';
    }
}
