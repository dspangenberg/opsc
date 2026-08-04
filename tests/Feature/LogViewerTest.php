<?php

use App\Models\User;

beforeEach(function () {
    $this->tenantDomain = 'test-tenant.localhost';
    config()->set('log-viewer.enabled', true);
});

it('is accessible without tenant auth', function () {
    $this
        ->withServerVariables(['HTTP_HOST' => $this->tenantDomain])
        ->get('http://'.$this->tenantDomain.'/log-viewer')
        ->assertOk();
});

it('is accessible for regular users', function () {
    $user = User::factory()->create(['is_admin' => false]);

    $this
        ->actingAs($user)
        ->withServerVariables(['HTTP_HOST' => $this->tenantDomain])
        ->get('http://'.$this->tenantDomain.'/log-viewer')
        ->assertOk();
});

it('includes the nginx logs from the vhost log directory', function () {
    $includeFiles = config('log-viewer.include_files');

    expect($includeFiles)
        ->toHaveKey('/home/twiceware/vhosts/twiceware-opsc.de/logs/*')
        ->and($includeFiles['/home/twiceware/vhosts/twiceware-opsc.de/logs/*'])
        ->toBe('Nginx');
});
