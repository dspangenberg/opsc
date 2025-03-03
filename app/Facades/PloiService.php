<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\PloiService
 */
class PloiService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\PloiService::class;
    }
}
