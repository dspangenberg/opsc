<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Services;

use App\Mail\VerifyEmailAddressForCloudRegistrationMail;
use App\Models\TempData;
use App\Models\Tenant;
use Cviebrock\EloquentSluggable\Services\SlugService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Stancl\Tenancy\UniqueIdentifierGenerators\RandomHexGenerator;

class CloudRegisterService
{
    public function storeRegistrationTemporary(array $tenant): void
    {
        $tempTenant = TempData::create(['data' => $tenant, 'parent_type' => 'cloud.register']);

        $url = URL::temporarySignedRoute('cloud.register.verify', now()->addHours(24), ['hid' => $tempTenant->hid]);
        $this->sendVerificationEmail($tempTenant, $url);
    }

    private function sendVerificationEmail(TempData $tenant, string $verificationUrl): void
    {
        Mail::to($tenant['data']['email'])->send(new VerifyEmailAddressForCloudRegistrationMail($tenant,
            $verificationUrl));
    }

    public function verifyEmailAddressAndCredentials(string $hid): array
    {
        $tenant = TempData::getByHid($hid)['data'];

        $hostname = parse_url($tenant['website'], PHP_URL_HOST);
        $hostnameParts = explode('.', $hostname);

        if (count($hostnameParts) === 2) {
            $hostname = $hostnameParts[0];
        }

        if (count($hostnameParts) === 3) {
            $hostname = $hostnameParts[1];
        }

        if (! $hostname) {
            // $hostname = SlugService::createSlug(Tenant::class, 'subdomain', $tenant['organisation']);
        } else {
            // $hostname = SlugService::createSlug(Tenant::class, 'subdomain', $hostname);
        }

        $tenant['domain'] = $hostname;

        return $tenant;
    }

    public function createTenant(array $tenantData): Tenant
    {
        $tempTenantData = TempData::getByHid($tenantData['hid'])['data'];

        $tempTenantData['password'] = bcrypt($tenantData['password']);
        $domain = $tenantData['domain'];
        $tempTenantData['ready'] = false;

        $tenant = Tenant::create($tempTenantData);
        $tenant->prefix = RandomHexGenerator::generate($tenant);
        $tenant->save();
        $tenant->createDomain(['domain' => $domain]);
        TempData::getByHid($tenantData['hid'])->delete();

        return $tenant;

    }
}
