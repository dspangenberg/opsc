<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Console\Commands;

use App\Facades\CloudRegisterService;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Password;

use function Laravel\Prompts\select;
use function Laravel\Prompts\text;

class CreateTenantCommand extends Command
{
    protected $signature = 'create:tenant';

    protected $description = 'Erstellt einen neuen Mandanten mit Admin-Benutzer';

    public function handle(): void
    {
        $data = [
            'company' => '',
            'first_name' => '',
            'last_name' => '',
            'email' => '',
            'website' => 'https://',
            'domain' => '',
        ];

        $admin = [
            'first_name' => '',
            'last_name' => '',
            'email' => '',
        ];

        $step = 1;

        while (true) {
            if ($step === 4) {
                $result = $this->stepConfirm($data, $admin);

                if ($result === 0) {
                    return;
                }

                if ($result === null) {
                    $this->warn('Abgebrochen.');

                    return;
                }

                $step = $result;

                continue;
            }

            match ($step) {
                1 => $this->stepTenantData($data),
                2 => $this->stepDomain($data),
                3 => $this->stepAdmin($data, $admin),
            };

            $action = select('Aktion:', $step === 1
                ? ['next' => 'Weiter', 'cancel' => 'Abbrechen']
                : ['next' => 'Weiter', 'back' => 'Zurück']
            );

            $step = match ($action) {
                'next' => $step + 1,
                'back' => $step - 1,
                'cancel' => null,
            };

            if ($step === null) {
                $this->warn('Abgebrochen.');

                return;
            }
        }
    }

    private function stepTenantData(array &$data): void
    {
        $this->line('Mandant-Daten:');
        $data['company'] = text('Firma:', required: true, default: $data['company']);
        $data['first_name'] = text('Vorname:', required: true, default: $data['first_name']);
        $data['last_name'] = text('Name:', required: true, default: $data['last_name']);
        $data['email'] = text('E-Mail:', required: true, default: $data['email']);
        $data['website'] = text('Website:', required: true, default: $data['website'] ?: 'https://');

        $data['domain'] = CloudRegisterService::verifyEmailAddressAndCredentials($data);
    }

    private function stepDomain(array &$data): void
    {
        $domain = str_replace('https://', '', (string) env('APP_URL'));
        $this->line("Domain: [subdomain].{$domain}");

        $data['domain'] = text('Subdomain:', required: true, default: $data['domain']);
    }

    private function stepAdmin(array &$data, array &$admin): void
    {
        $this->line('Admin-Daten:');
        $admin['first_name'] = text('Vorname:', required: true, default: $data['first_name']);
        $admin['last_name'] = text('Name:', required: true, default: $data['last_name']);
        $admin['email'] = text('E-Mail:', required: true, default: $data['email']);
    }

    private function stepConfirm(array $data, array $admin): ?int
    {
        $this->table(
            ['Feld', 'Wert'],
            [
                ['Firma', $data['company']],
                ['Vorname', $data['first_name']],
                ['Name', $data['last_name']],
                ['E-Mail', $data['email']],
                ['Website', $data['website']],
                ['Subdomain', $data['domain']],
            ],
        );

        $action = select('Aktion:', [
            'finish' => 'Alles korrekt — Mandant erstellen',
            'edit1' => 'Mandant-Daten bearbeiten',
            'edit2' => 'Subdomain bearbeiten',
            'edit3' => 'Admin-Daten bearbeiten',
            'cancel' => 'Abbrechen',
        ]);

        if ($action !== 'finish') {
            return match ($action) {
                'edit1' => 1,
                'edit2' => 2,
                'edit3' => 3,
                'cancel' => null,
            };
        }

        $this->line('Mandant und Admin-User werden erstellt');
        $tenant = CloudRegisterService::createTenant(array_merge($data, $admin));
        $tenant->run(function () use ($admin): void {
            Password::sendResetLink(
                ['email' => $admin['email']],
            );
            $this->line('E-Mail zum Zurücksetzen des Passworts wurde versendet.');
        });

        return 0;
    }
}
