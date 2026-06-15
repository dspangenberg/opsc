<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

class PdfService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\PdfService::class;
    }
}
