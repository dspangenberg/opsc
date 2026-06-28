<?php

namespace App\Facades;

use App\Services\MoneyMoneyService;
use Illuminate\Support\Facades\Facade;

/**
 * @see MoneyMoneyService
 */
class HolviService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\HolviService::class;
    }
}
