<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Tests\TestCase;

uses(TestCase::class);

test('invoice report route is matched before the invoice show route', function () {
    $request = Request::create('/app/invoicing/invoices/report', 'GET');
    $route = Route::getRoutes()->match($request);

    expect($route->getName())->toBe('app.invoice.report');
});
