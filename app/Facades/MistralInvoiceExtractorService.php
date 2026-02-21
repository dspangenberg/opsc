<?php

namespace App\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @see \App\Services\MistralDocumentExtractorService
 */
class MistralInvoiceExtractorService extends Facade
{
    protected static function getFacadeAccessor(): string
    {
        return \App\Services\MistralInvoiceExtractorService::class;
    }
}
