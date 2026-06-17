<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\ZugferdService
 */
class ZugferdService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\ZugferdService::class;
    }
}
