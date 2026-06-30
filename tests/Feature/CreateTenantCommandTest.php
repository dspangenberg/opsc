<?php

use App\Facades\CloudRegisterService;
use App\Models\Tenant;
use Illuminate\Support\Facades\Password;

use Laravel\Prompts\Prompt;

beforeEach(function () {
    // Ensure tenant() is available in the testing context
    $tenant = Tenant::create([
        'id' => 'test-tenant-'.uniqid(),
        'organisation' => 'Test Org',
        'ready' => false,
    ]);

    tenancy()->initialize($tenant);
});

test('it creates a tenant and sends a reset link via the full wizard flow', function () {
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

    Prompt::fake([
        'T', 'e', 's', 't', "\n",       // company: "Test"
        'J', 'o', 'h', 'n', "\n",        // first_name: "John"
        'D', 'o', 'e', "\n",             // last_name: "Doe"
        't', 'e', 's', 't', '@', 'e', 'x', 'a', 'm', 'p', 'l', 'e', '.', 'c', 'o', 'm', "\n", // email
        "https://example.com\n",         // website
        "\n",                            // Weiter (step 1 → 2)
        'm', 'y', 'a', 'p', 'p', "\n",  // subdomain: "myapp"
        "\n",                            // Weiter (step 2 → 3)
        'A', 'd', 'm', 'i', 'n', "\n",  // admin first_name
        'U', 's', 'e', 'r', "\n",       // admin last_name
        'a', 'd', 'm', 'i', 'n', '@', 'e', 'x', 'a', 'm', 'p', 'l', 'e', '.', 'c', 'o', 'm', "\n", // admin email
        "\n",                            // Weiter (step 3 → 4)
        "\n",                            // "Alles korrekt" (default selection)
    ]);

    $this->artisan('create:tenant')
        ->expectsOutputToContain('Mandant und Admin-User werden erstellt')
        ->assertSuccessful();
});

test('it cancels at step 1 when cancel is chosen', function () {
    CloudRegisterService::shouldReceive('verifyEmailAddressAndCredentials')
        ->once()
        ->andReturn('example');

    CloudRegisterService::shouldReceive('createTenant')
        ->never();

    Prompt::fake([
        'A', 'C', 'M', 'E', "\n",       // company
        'J', 'a', 'n', 'e', "\n",       // first_name
        'D', 'o', 'e', "\n",            // last_name
        'j', '@', 't', 'e', 's', 't', '.', 'c', 'o', 'm', "\n", // email
        "https://test.com\n",           // website
        "\e[B", "\n",                   // Arrow Down → "Abbrechen", Enter
    ]);

    $this->artisan('create:tenant')
        ->expectsOutputToContain('Abgebrochen.')
        ->assertSuccessful();
});

test('it navigates back from step 3 to step 2 when back is chosen', function () {
    CloudRegisterService::shouldReceive('verifyEmailAddressAndCredentials')
        ->once()
        ->andReturn('example');

    CloudRegisterService::shouldReceive('createTenant')
        ->never();

    Prompt::fake([
        'T', 'e', 's', 't', "\n",       // company
        'J', 'o', 'h', 'n', "\n",        // first_name
        'D', 'o', 'e', "\n",             // last_name
        't', '@', 't', '.', 'c', 'o', 'm', "\n", // email
        "https://t.com\n",              // website
        "\n",                            // Weiter (step 1 → 2)
        'm', 'y', 'a', 'p', 'p', "\n",  // subdomain
        "\n",                            // Weiter (step 2 → 3)
        'A', 'd', 'm', 'i', 'n', "\n",  // admin first_name
        'U', 's', 'e', 'r', "\n",       // admin last_name
        'a', '@', 'e', '.', 'c', 'o', 'm', "\n", // admin email
        "\e[B", "\n",                   // Arrow Down → "Zurück", Enter
        'o', 't', 'h', 'e', 'r', "\n", // subdomain (step 2 again)
        "\n",                            // Weiter (step 2 → 3)
        'A', 'd', 'm', 'i', 'n', '2', "\n", // admin first_name
        'U', 's', 'e', 'r', '2', "\n",  // admin last_name
        'a', '2', '@', 'e', '.', 'c', 'o', 'm', "\n", // admin email
        "\n",                            // Weiter (step 3 → 4)
        "\n",                            // cancel/finish at confirmation
    ]);

    $this->artisan('create:tenant')->assertSuccessful();
});

test('it allows editing step 1 from the confirmation screen', function () {
    CloudRegisterService::shouldReceive('verifyEmailAddressAndCredentials')
        ->once()
        ->andReturn('example');

    Prompt::fake([
        'C', 'o', '1', "\n",            // company
        'F', '1', "\n",                 // first_name
        'L', '1', "\n",                 // last_name
        'e', '1', '@', 't', '.', 'c', 'o', 'm', "\n", // email
        "https://e1.com\n",            // website
        "\n",                            // Weiter (step 1 → 2)
        's', 'u', 'b', '1', "\n",      // subdomain
        "\n",                            // Weiter (step 2 → 3)
        'A', '1', "\n",                 // admin first_name
        'A', '2', "\n",                 // admin last_name
        'a', '3', '@', 't', '.', 'c', 'o', 'm', "\n", // admin email
        "\n",                            // Weiter (step 3 → 4)
        "\e[B", "\e[B", "\n",          // Arrow Down × 2 → "Mandant-Daten bearbeiten", Enter
        'C', 'o', '2', "\n",            // company (edited)
        'F', '2', "\n",                 // first_name (edited)
        'L', '2', "\n",                 // last_name (edited)
        'e', '2', '@', 't', '.', 'c', 'o', 'm', "\n", // email (edited)
        "https://e2.com\n",            // website (edited)
        "\n",                            // Weiter (step 1 → 2, subdomain unchanged)
        "\n",                            // Weiter (step 2 → 3, admin unchanged)
        "\n",                            // Weiter (step 3 → 4)
        "\n",                            // "Alles korrekt"
    ]);

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
        ->with(['email' => 'a3@t.com']);

    $this->artisan('create:tenant')
        ->expectsOutputToContain('Mandant und Admin-User werden erstellt')
        ->assertSuccessful();
});
