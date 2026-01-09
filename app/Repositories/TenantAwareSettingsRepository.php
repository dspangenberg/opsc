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
        // Stancl Tenancy v4 creates the 'tenant' connection dynamically
        // via DatabaseTenancyBootstrapper when tenancy is initialized
        if (tenancy()->initialized) {
            // Verify the connection exists before returning it
            if (array_key_exists('tenant', config('database.connections', []))) {
                return 'tenant';
            }

            // Fallback: If tenant connection doesn't exist yet, return null
            // to use the default connection (shouldn't happen in normal flow)
            return null;
        }

        return config('database.default');
    }

    protected function getTable(): string
    {
        return config('settings.repositories.database.table', 'settings');
    }
}
