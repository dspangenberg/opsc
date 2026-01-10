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
class ProjectData extends Data
{
    public function __construct(
        public readonly ?int $id,
        public readonly string $name,

        public readonly ?string $website,

        public readonly ?int $owner_contact_id,
        public readonly ?int $lead_user_id,
        public readonly int $manager_contact_id,

        public readonly int $project_category_id,
        public readonly bool $is_archived,
        public readonly float $hourly,

        public readonly ?float $budget_hours,
        public readonly ?float $budget_costs,
        public readonly ?string $budget_period,
        public readonly ?string $avatar_url,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $begin_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public readonly ?DateTime $end_on,

        public readonly ?ContactData $owner,
        public readonly ?UserData $user,
        public readonly ?ContactData $manager,

        public readonly ?ProjectCategoryData $category,

    ) {}

    public function defaultWrap(): string
    {
        return 'data';
    }
}
