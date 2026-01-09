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

        public int $owner_contact_id,
        public int $lead_user_id,
        public int $manager_contact_id,

        public int $project_category_id,
        public bool $is_archived,
        public float $hourly,

        public ?float $budget_hours,
        public ?float $budget_costs,
        public ?string $budget_period,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public ?DateTime $begin_on,

        #[WithTransformer(DateTimeInterfaceTransformer::class, format: 'd.m.Y')]
        public ?DateTime $end_on,

        public ?string $website,

        public readonly ?ContactData $owner,
        public readonly ?UserData $leadUser,
        public readonly ?ContactData $managerContact,

        public readonly ?ProjectCategoryData $category,

    ) {}

    public function defaultWrap(): string
    {
        return 'data';
    }
}
