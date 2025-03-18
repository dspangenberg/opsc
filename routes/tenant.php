<?php
/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

declare(strict_types=1);

use App\Http\Controllers\App\Contact\ContactDetailsController;
use App\Http\Controllers\App\Contact\ContactIndexController;
use App\Http\Controllers\App\Contact\ContactToggleFavoriteController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsController;
use App\Http\Controllers\App\Invoice\InvoiceIndexController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Features\UserImpersonation;
use Stancl\Tenancy\Middleware;
use Laragear\WebAuthn\Http\Routes as WebAuthnRoutes;


/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::get('/', function () {
    return redirect(route('app.dashboard'));
});

Route::middleware([
    'web',
    'auth',
    Middleware\InitializeTenancyByDomainOrSubdomain::class,
    Middleware\PreventAccessFromUnwantedDomains::class,
    Middleware\ScopeSessions::class,
])->prefix('app')->group(function () {
    Route::get('/', function () {
        return Inertia::render('App/Dashboard');
    })->name('app.dashboard');

    Route::get('contacts',
        ContactIndexController::class)->name('app.contact.index');

    Route::get('contacts/{contact}',
        ContactDetailsController::class)->name('app.contact.details');


    Route::put('contacts/{contact}/toggle-favorite',
        ContactToggleFavoriteController::class)->name('app.contact.toggle-favorite');

    Route::get('invoices',
        InvoiceIndexController::class)->name('app.invoice.index');

    Route::get('invoices/{invoice}',
        InvoiceDetailsController::class)->name('app.invoice.details');


    Route::get('/soon', function () {
        return Inertia::render('Soon');
    })->name('app.soon');


    Route::get('/onboarding', function () {
        return Inertia::modal('Onboarding')->baseRoute('app.soon');
    })->name('app.onboarding');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('app.logout');
});

Route::middleware([
    'web',
    Middleware\InitializeTenancyByDomainOrSubdomain::class,
    Middleware\PreventAccessFromUnwantedDomains::class,
    Middleware\ScopeSessions::class,
])->prefix('auth')->group(function () {

    WebAuthnRoutes::register()->withoutMiddleware(VerifyCsrfToken::class);

    Route::get('/impersonate/{token}', function ($token) {
        return UserImpersonation::makeResponse($token);
    })->name('tenant.impersonate');
    Route::get('login', [
        AuthenticatedSessionController::class, 'create'
    ])->name('login');
    Route::post('login', [
        AuthenticatedSessionController::class, 'store'
    ])->middleware([HandlePrecognitiveRequests::class])->name('login.store');
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});
