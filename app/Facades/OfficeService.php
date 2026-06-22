<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\OfficeService
 */
class OfficeService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\OfficeService::class;
    }
}
