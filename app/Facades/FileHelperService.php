<?php

/*
 * Beleg-Portal is a twiceware solution
 * Copyright (c) 2025 by Rechtsanwalt Peter Trettin
 *
 */

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\FileHelperService
 */
class FileHelperService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\FileHelperService::class;
    }
}
