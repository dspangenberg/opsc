<?php

namespace App\Facades;

use App\Services\BookkeepingRuleService;
use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\BookkeepingRuleService
 */
class BookeepingRuleService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return BookkeepingRuleService::class;
    }
}
