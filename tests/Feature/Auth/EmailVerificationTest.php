<?php

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\URL;
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

test('email can be verified', function () {
    $user = User::factory()->unverified()->create();

    Event::fake();

    URL::forceRootUrl('https://'.$this->domain->domain);

    $verificationUrl = URL::temporarySignedRoute(
        'email.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1($user->email)]
    );

    $response = $this
        ->actingAs($user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('https://'.$this->domain->domain.'/auth/confirm-email/'.$user->id.'/'.sha1($user->email).'?'.parse_url($verificationUrl, PHP_URL_QUERY));

    Event::assertDispatched(Verified::class);

    expect($user->fresh()->hasVerifiedEmail())->toBeTrue();
    $response->assertRedirect(route('app.dashboard', absolute: false).'?verified=1');
});

test('email is not verified with invalid hash', function () {
    $user = User::factory()->unverified()->create();

    URL::forceRootUrl('https://'.$this->domain->domain);

    $verificationUrl = URL::temporarySignedRoute(
        'email.verify',
        now()->addMinutes(60),
        ['id' => $user->id, 'hash' => sha1('wrong-email')]
    );

    $this
        ->actingAs($user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('https://'.$this->domain->domain.'/auth/confirm-email/'.$user->id.'/'.sha1('wrong-email').'?'.parse_url($verificationUrl, PHP_URL_QUERY));

    expect($user->fresh()->hasVerifiedEmail())->toBeFalse();
});
