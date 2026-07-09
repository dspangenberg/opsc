<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Exceptions\TenantCouldNotBeIdentifiedByIdException;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(/**
 * @throws TenantCouldNotBeIdentifiedByIdException
 */ function () {
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

test('password can be updated', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    Tenancy::end();
    $password = Str::password(12);

    $response = $this
        ->actingAs($user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->from('http://'.$this->domain->domain.'/app/profile/password')
        ->put('http://'.$this->domain->domain.'/app/profile/password', [
            'current_password' => 'password',
            'password' => $password,
            'password_confirmation' => $password,
        ]);

    $response
        ->assertSessionHasNoErrors()
        ->assertRedirect('/app/profile/password');

    $this->assertTrue(Hash::check($password, $user->refresh()->password));
});

test('correct password must be provided to update password', function () {
    $user = User::factory()->create([
        'password' => Hash::make('password'),
    ]);

    Tenancy::end();
    $password = Str::password(12);

    $response = $this
        ->actingAs($user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->from('http://'.$this->domain->domain.'/app/profile/password')
        ->put('http://'.$this->domain->domain.'/app/profile/password', [
            'current_password' => 'wrong-password',
            'password' => $password,
            'password_confirmation' => $password,
        ]);

    $response
        ->assertSessionHasErrors('current_password')
        ->assertRedirect('/app/profile/password');
});
