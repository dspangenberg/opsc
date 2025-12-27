<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\MultidocService
 */
class MultidocService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\MultidocService::class;
    }
}
