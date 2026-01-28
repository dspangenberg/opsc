<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\DownloadService
 */
class DownloadService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\DownloadService::class;
    }
}
