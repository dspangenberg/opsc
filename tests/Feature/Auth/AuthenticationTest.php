<?php

use App\Models\Tenant;
use App\Models\User;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->domain = Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-'.$this->tenant->id.'.test',
    ]);
    Tenancy::initialize($this->tenant);
    $this->artisan('tenants:migrate');
});

afterEach(function () {
    auth()->logout();
    Tenancy::end();
});

test('login screen can be rendered', function () {
    Tenancy::end();

    $response = $this
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/auth/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::factory()->create();

    Tenancy::end();

    $response = $this
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/auth/login', [
            'email' => $user->email,
            'password' => 'password',
        ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('app.dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::factory()->create();

    Tenancy::end();

    $this
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/auth/login', [
            'email' => $user->email,
            'password' => 'wrong-password',
        ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::factory()->create();

    Tenancy::end();

    $response = $this
        ->actingAs($user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/app/logout');

    $this->assertGuest();
    $response->assertRedirect(route('login', absolute: false));
});
