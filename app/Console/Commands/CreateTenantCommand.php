<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Console\Commands;

use Illuminate\Console\Command;

use function Laravel\Prompts\form;

class CreateTenantCommand extends Command
{
    protected $signature = 'create:tenant';
    protected $description = 'Command description';

    public function handle(): void
    {
        $this->line('Tenant erstellen:');

        $tenantData = form()
            ->text('Firma:', required: true, default: '', name: 'company')
            ->text('Vorname:', required: true, default: '', name: 'first_name')
            ->text('Name:', required: true, default: '', name: 'last_name')
            ->text('E-Mail:', required: true, default: '', name: 'email')
            ->submit();

        $this->line('Domain:');

        $this->line('Admin erstellen:');

        $adminData = form()
            ->text('Vorname:', required: true, default: $tenantData['first_name'], name: 'first_name')
            ->text('Name:', required: true, default: $tenantData['last_name'], name: 'last_name')
            ->text('E-Mail:', required: true, default: $tenantData['email'], name: 'email')
            ->submit();


        ray($tenantData);




    }
}
