<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

declare(strict_types=1);

use App\Http\Controllers\App\Contact\ContactAddressCreateController;
use App\Http\Controllers\App\Contact\ContactAddressStoreController;
use App\Http\Controllers\App\Contact\ContactAddressUpdateController;
use App\Http\Controllers\App\Contact\ContactDetailsController;
use App\Http\Controllers\App\Contact\ContactEditAddressController;
use App\Http\Controllers\App\Contact\ContactIndexController;
use App\Http\Controllers\App\Contact\ContactToggleFavoriteController;
use App\Http\Controllers\App\Invoice\InvoiceDeleteController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsEditBaseController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsEditLinesController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsUpdateBaseController;
use App\Http\Controllers\App\Invoice\InvoiceDuplicateController;
use App\Http\Controllers\App\Invoice\InvoiceIndexController;
use App\Http\Controllers\App\Invoice\InvoiceLineDeleteController;
use App\Http\Controllers\App\Invoice\InvoiceLineDuplicateController;
use App\Http\Controllers\App\Invoice\InvoiceLineEditController;
use App\Http\Controllers\App\Invoice\InvoiceLineUpdateController;
use App\Http\Controllers\App\Invoice\InvoiceMarkAsSentController;
use App\Http\Controllers\App\Invoice\InvoicePdfDownloadController;
use App\Http\Controllers\App\Invoice\InvoiceReleaseController;
use App\Http\Controllers\App\Invoice\InvoiceUnreleaseController;
use App\Http\Controllers\App\Time\TimeIndexController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Features\UserImpersonation;
use Stancl\Tenancy\Middleware;

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

    Route::get('times',
        TimeIndexController::class)->name('app.time.index');

    Route::get('contacts/{contact}',
        ContactDetailsController::class)->name('app.contact.details');

    Route::get('contacts/{contact}/{address}/edit',
        ContactEditAddressController::class)->name('app.contact.edit.address');

    Route::get('contacts/{contact}/create',
        ContactAddressCreateController::class)->name('app.contact.create.address');

    Route::put('contacts/{contact}/{contact_address}',
        ContactAddressUpdateController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.contact.address.update');

    Route::post('contacts/{contact}/address',
        ContactAddressStoreController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.contact.address.store');

    Route::put('contacts/{contact}/toggle-favorite',
        ContactToggleFavoriteController::class)->name('app.contact.toggle-favorite');

    Route::get('invoicing/invoices',
        InvoiceIndexController::class)->name('app.invoice.index');

    Route::get('invoicing/invoices/{invoice}',
        InvoiceDetailsController::class)->name('app.invoice.details');

    Route::delete('invoicing/invoices/{invoice}',
        InvoiceDeleteController::class)->name('app.invoice.delete');

    Route::get('invoicing/invoices/{invoice}/base-edit',
        InvoiceDetailsEditBaseController::class)->name('app.invoice.base-edit');

    Route::get('invoicing/invoices/{invoice}/lines-edit',
        InvoiceDetailsEditLinesController::class)->name('app.invoice.lines-edit');

    Route::get('invoicing/invoices/{invoice}/unrelease',
        InvoiceUnreleaseController::class)->name('app.invoice.unrelease');

    Route::get('invoicing/invoices/{invoice}/release',
        InvoiceReleaseController::class)->name('app.invoice.release');

    Route::get('invoicing/invoices/{invoice}/mark-as-sent',
        InvoiceMarkAsSentController::class)->name('app.invoice.mark-as-sent');

    Route::get('invoicing/invoices/{invoice}/line-duplicate/{invoiceLine}',
        InvoiceLineDuplicateController::class)->name('app.invoice.line-duplicate')->middleware([HandlePrecognitiveRequests::class]);


    Route::get('invoicing/invoices/{invoice}/line-edit/{invoiceLine}',
        InvoiceLineEditController::class)->name('app.invoice.line-edit')->middleware([HandlePrecognitiveRequests::class]);


    Route::put('invoicing/invoices/{invoice}/line-update/{invoiceLine}',
        InvoiceLineUpdateController::class)->name('app.invoice.line-update')->middleware([HandlePrecognitiveRequests::class]);

    Route::delete('invoicing/invoices/{invoice}/line-delete/{invoiceLine}',
        InvoiceLineDeleteController::class)->name('app.invoice.line-delete')->middleware([HandlePrecognitiveRequests::class]);

    Route::put('invoicing/invoices/{invoice}/base-update',
        InvoiceDetailsUpdateBaseController::class)->name('app.invoice.base-update')->middleware([HandlePrecognitiveRequests::class]);

    Route::get('invoicing/invoices/{invoice}/duplicate',
        InvoiceDuplicateController::class)->name('app.invoice.duplicate')->middleware([HandlePrecognitiveRequests::class]);

    Route::get('invoicing/invoices/{invoice}/pdf',
        InvoicePdfDownloadController::class)->name('app.invoice.pdf');

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

    Route::get('/impersonate/{token}', function ($token) {
        return UserImpersonation::makeResponse($token);
    })->name('tenant.impersonate');
    Route::get('login', [
        AuthenticatedSessionController::class, 'create',
    ])->name('login');
    Route::post('login', [
        AuthenticatedSessionController::class, 'store',
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
