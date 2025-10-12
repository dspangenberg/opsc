<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\ReceiptService
 */
class ReceiptService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\ReceiptService::class;
    }
}
