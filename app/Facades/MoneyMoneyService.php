<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\MoneyMoneyService
 */
class MoneyMoneyService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\MoneyMoneyService::class;
    }
}
