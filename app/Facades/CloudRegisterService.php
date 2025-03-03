<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\CloudRegisterService
 */
class CloudRegisterService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\CloudRegisterService::class;
    }
}
