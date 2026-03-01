<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\SendEmailAsTenantService
 */
class SendEmailAsTenantService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\SendEmailAsTenantService::class;
    }
}
