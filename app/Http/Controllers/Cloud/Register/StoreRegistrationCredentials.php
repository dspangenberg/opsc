<?php

namespace App\Http\Controllers\Cloud\Register;

use App\Facades\CloudRegisterService;
use App\Http\Requests\RegisterCredentialsRequest;
use Inertia\Inertia;

class StoreRegistrationCredentials
{
    public function __invoke(RegisterCredentialsRequest $request)
    {

        $tenantData = collect($request->validated())->only(
            'email', 'password', 'domain', 'hid'
        )->toArray();

        $tenant = CloudRegisterService::createTenant($tenantData);
        $domain = str_replace('https://', '', Env('APP_URL'));
        $domain = $tenantData['domain'].'.'.$domain;

        $token = tenancy()->impersonate($tenant, 1, tenant_route($domain, 'app.dashboard'), 'web')->token;

        return Inertia::location(tenant_route($domain, 'tenant.impersonate', ['token' => $token]));
    }
}
