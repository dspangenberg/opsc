<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\DropboxService
 */
class DropboxService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\DropboxService::class;
    }
}
