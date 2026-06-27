<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\SearchablePdfService
 */
class SearchablePdfService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\SearchablePdfService::class;
    }
}
