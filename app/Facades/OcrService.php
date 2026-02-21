<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\OcrService
 */
class OcrService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\OcrService::class;
    }
}
