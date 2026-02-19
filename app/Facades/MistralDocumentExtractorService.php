<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\MistralDocumentExtractorService
 */
class MistralDocumentExtractorService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\MistralDocumentExtractorService::class;
    }
}
