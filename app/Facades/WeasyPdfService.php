<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class WeasyPdfService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\WeasyPdfService::class;
    }
}
