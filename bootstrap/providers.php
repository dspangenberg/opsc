<?php

use App\Providers\AppServiceProvider;
use App\Providers\AuthServiceProvider;
use App\Providers\TenancyServiceProvider;
use App\Providers\TypeScriptTransformerServiceProvider;
use App\Providers\ValidationServiceProvider;

return [
    AppServiceProvider::class,
    AuthServiceProvider::class,
    TenancyServiceProvider::class,
    TypeScriptTransformerServiceProvider::class,
    ValidationServiceProvider::class,
];
