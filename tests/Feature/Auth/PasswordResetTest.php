<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
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
    Tenancy::end();
});

test('reset password link screen can be rendered', function () {
    Tenancy::end();

    $response = $this
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/auth/forgot-password');

    $response->assertStatus(200);
});

test('reset password link can be requested', function () {
    $user = User::factory()->create();

    Tenancy::end();

    $response = $this
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/auth/forgot-password', ['email' => $user->email]);

    $response->assertSessionHasNoErrors();
    $response->assertStatus(302);

    Tenancy::initialize($this->tenant);
    $tokenExists = DB::connection('tenant')
        ->table('password_reset_tokens')
        ->where('email', $user->email)
        ->exists();
    expect($tokenExists)->toBeTrue('Password reset token should exist in tenant DB');
});

test('reset password screen can be rendered', function () {
    $user = User::factory()->create();

    // Use the password broker to create a plaintext token (the DB stores the hash)
    $token = Password::broker()->createToken($user);

    Tenancy::end();

    $response = $this
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/auth/reset-password/'.$token);

    $response->assertStatus(200);
});

test('password can be reset with valid token', function () {
    $user = User::factory()->create();

    // Create a password reset token directly via the password broker
    // This returns the plaintext token while storing the hash in the DB
    $token = Password::broker()->createToken($user);

    Tenancy::end();
    $password = Str::password(12);

    $response = $this
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->post('http://'.$this->domain->domain.'/auth/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => $password,
            'password_confirmation' => $password,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('app.dashboard', absolute: false));
});
