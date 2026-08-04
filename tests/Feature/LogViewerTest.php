<?php

// Provide a known nginx log path for the environment-driven include_files entry.
putenv('LOG_VIEWER_NGINX_LOG_PATH=/srv/test-nginx-logs/*');

beforeEach(function () {
    $this->tenantDomain = 'test-tenant.localhost';
    config()->set('log-viewer.enabled', true);
});

it('is accessible without auth in local development', function () {
    $this
        ->withServerVariables(['HTTP_HOST' => $this->tenantDomain])
        ->get('http://'.$this->tenantDomain.'/log-viewer')
        ->assertOk();
});

it('is accessible without auth in production', function () {
    $this->app->detectEnvironment(fn () => 'production');
    config()->set('log-viewer.require_auth_in_production', false);

    $this
        ->withServerVariables(['HTTP_HOST' => $this->tenantDomain])
        ->get('http://'.$this->tenantDomain.'/log-viewer')
        ->assertOk();
});

it('labels the configured nginx log path as Nginx', function () {
    $nginxPath = getenv('LOG_VIEWER_NGINX_LOG_PATH');
    $includeFiles = config('log-viewer.include_files');

    expect($nginxPath)->toBeString()->not->toBe('')
        ->and($includeFiles)->toHaveKey($nginxPath)
        ->and($includeFiles[$nginxPath])->toBe('Nginx');
});
