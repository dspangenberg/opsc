<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\MoneyMoneyService
 */
class HolviService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\HolviService::class;
    }
}
