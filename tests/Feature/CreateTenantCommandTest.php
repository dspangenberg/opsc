<?php

use App\Facades\CloudRegisterService;
use App\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Password;
use Symfony\Component\Console\Output\BufferedOutput;

beforeEach(function () {
    $tenant = Tenant::create([
        'id' => 'test-tenant-'.uniqid(),
        'organisation' => 'Test Org',
        'ready' => false,
    ]);

    tenancy()->initialize($tenant);
});

test('it creates a tenant and sends a reset link via options', function () {
    CloudRegisterService::shouldReceive('verifyEmailAddressAndCredentials')
        ->once()
        ->andReturn('example');

    CloudRegisterService::shouldReceive('createTenant')
        ->once()
        ->andReturnUsing(function (array $data) {
            $tenant = Tenant::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'organisation' => $data['company'],
                'website' => $data['website'] ?? '',
                'ready' => false,
            ]);

            return $tenant;
        });

    Password::shouldReceive('sendResetLink')
        ->once()
        ->with(['email' => 'admin@example.com']);

    $output = new BufferedOutput;
    $exitCode = Artisan::call('create:tenant', [
        '--company' => 'Test',
        '--first-name' => 'John',
        '--last-name' => 'Doe',
        '--email' => 'test@example.com',
        '--website' => 'https://example.com',
        '--subdomain' => 'myapp',
        '--admin-first-name' => 'Admin',
        '--admin-last-name' => 'User',
        '--admin-email' => 'admin@example.com',
    ], $output);

    expect($exitCode)->toBe(0);
    expect($output->fetch())->toContain('Mandant und Admin-User werden erstellt');
});

test('it creates a tenant with only required options', function () {
    CloudRegisterService::shouldReceive('verifyEmailAddressAndCredentials')
        ->once()
        ->andReturn('example');

    CloudRegisterService::shouldReceive('createTenant')
        ->once()
        ->andReturnUsing(function (array $data) {
            $tenant = Tenant::create([
                'first_name' => $data['first_name'],
                'last_name' => $data['last_name'],
                'email' => $data['email'],
                'organisation' => $data['company'],
                'website' => $data['website'] ?? 'https://',
                'ready' => false,
            ]);

            return $tenant;
        });

    Password::shouldReceive('sendResetLink')
        ->once()
        ->with(['email' => 'admin@example.com']);

    $output = new BufferedOutput;
    $exitCode = Artisan::call('create:tenant', [
        '--company' => 'Test',
        '--first-name' => 'John',
        '--last-name' => 'Doe',
        '--email' => 'test@example.com',
        '--subdomain' => 'myapp',
        '--admin-email' => 'admin@example.com',
    ], $output);

    expect($exitCode)->toBe(0);
    expect($output->fetch())->toContain('Mandant und Admin-User werden erstellt');
});
