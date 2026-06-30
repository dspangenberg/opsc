<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Console\Commands;

use App\Facades\CloudRegisterService;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Password;

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
            ->text('Website:', required: true, default: 'https://', name: 'website')
            ->submit();

        $domain = str_replace('https://', '', Env('APP_URL'));

        $tenantData['domain'] = CloudRegisterService::verifyEmailAddressAndCredentials($tenantData);

        $this->line('Domain [subdomain].'.$domain);

        $domainData = form()
            ->text('Subdomain:', required: true, default: $tenantData['domain'], name: 'domain')
            ->submit();

        $tenantData['domain'] = $domainData['domain'];

        $this->line('Admin erstellen:');

        $adminData = form()
            ->text('Vorname:', required: true, default: $tenantData['first_name'], name: 'first_name')
            ->text('Name:', required: true, default: $tenantData['last_name'], name: 'last_name')
            ->text('E-Mail:', required: true, default: $tenantData['email'], name: 'email')
            ->submit();

        $data = array_merge($tenantData, $adminData);

        $this->line('Tenant und Admin-User werden erstellt');
        $tenant = CloudRegisterService::createTenant($data);
        $tenant->run(function () {
            $user = User::first();
            Password::sendResetLink(
                ['email' => $user->email]
            );
            $this->line('E-Mail zum Zurücksetzen des Passworts wurde versendet.');
        });

    }
}
