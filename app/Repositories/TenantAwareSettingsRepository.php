<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Repositories;

use Spatie\LaravelSettings\SettingsRepositories\DatabaseSettingsRepository;

class TenantAwareSettingsRepository extends DatabaseSettingsRepository
{
    protected function getConnection(): ?string
    {
        return tenancy()->initialized
            ? 'tenant'
            : config('database.default');
    }

    protected function getTable(): string
    {
        return config('settings.repositories.database.table', 'settings');
    }
}
