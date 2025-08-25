<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\BookkeepingRuleService
 */
class BookeepingRuleService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\BookkeepingRuleService::class;
    }
}
