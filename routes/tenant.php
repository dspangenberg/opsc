<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

declare(strict_types=1);

use App\Http\Controllers\App\Bookkeeping\Booking\BookingIndexController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionConfirmController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionIndexController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionMoneyMoneyImportController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionPayInvoiceCreateController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionSetCounterAccountController;
use App\Http\Controllers\App\Contact\ContactAddressCreateController;
use App\Http\Controllers\App\Contact\ContactAddressStoreController;
use App\Http\Controllers\App\Contact\ContactAddressUpdateController;
use App\Http\Controllers\App\Contact\ContactCreateController;
use App\Http\Controllers\App\Contact\ContactDetailsController;
use App\Http\Controllers\App\Contact\ContactDetailsPersonsController;
use App\Http\Controllers\App\Contact\ContactEditAddressController;
use App\Http\Controllers\App\Contact\ContactEditController;
use App\Http\Controllers\App\Contact\ContactIndexController;
use App\Http\Controllers\App\Contact\ContactStoreController;
use App\Http\Controllers\App\Contact\ContactToggleFavoriteController;
use App\Http\Controllers\App\Contact\ContactUpdateController;
use App\Http\Controllers\App\Invoice\InvoiceCreateController;
use App\Http\Controllers\App\Invoice\InvoiceDeleteController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsAddOnAccountInvoiceController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsEditBaseController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsStoreOnAccountInvoiceController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsUpdateBaseController;
use App\Http\Controllers\App\Invoice\InvoiceDuplicateController;
use App\Http\Controllers\App\Invoice\InvoiceHistoryController;
use App\Http\Controllers\App\Invoice\InvoiceIndexController;
use App\Http\Controllers\App\Invoice\InvoiceLineDeleteController;
use App\Http\Controllers\App\Invoice\InvoiceLineDuplicateController;
use App\Http\Controllers\App\Invoice\InvoiceLineEditController;
use App\Http\Controllers\App\Invoice\InvoiceLineUpdateController;
use App\Http\Controllers\App\Invoice\InvoiceMarkAsSentController;
use App\Http\Controllers\App\Invoice\InvoicePaymentCreateController;
use App\Http\Controllers\App\Invoice\InvoicePaymentStoreController;
use App\Http\Controllers\App\Invoice\InvoicePdfDownloadController;
use App\Http\Controllers\App\Invoice\InvoiceReleaseController;
use App\Http\Controllers\App\Invoice\InvoiceStoreController;
use App\Http\Controllers\App\Invoice\InvoiceUnreleaseController;
use App\Http\Controllers\App\Time\TimeCreateController;
use App\Http\Controllers\App\Time\TimeDeleteController;
use App\Http\Controllers\App\Time\TimeEditController;
use App\Http\Controllers\App\Time\TimeIndexController;
use App\Http\Controllers\App\Time\TimeMyWeekIndexController;
use App\Http\Controllers\App\Time\TimePdfReportController;
use App\Http\Controllers\App\Time\TimeStoreController;
use App\Http\Controllers\App\Time\TimeUpateController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
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

    Route::get('times/create', TimeCreateController::class)->name('app.time.create');
    Route::post('times', TimeStoreController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.time.store');

    Route::get('times/all',
        TimeIndexController::class)->name('app.time.index');
    Route::get('times/my-week',
        TimeMyWeekIndexController::class)->name('app.time.my-week');

    Route::get('times/{time}/edit', TimeEditController::class)->name('app.time.edit');

    Route::put('times/{time}', TimeUpateController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.time.update');

    Route::get('times/pdf',
        TimePdfReportController::class)->name('app.time.pdf');

    Route::delete('times/{time}',
        TimeDeleteController::class)->name('app.times.delete');

    Route::get('bookkeeping/transactions/confirm/',
        TransactionConfirmController::class)
        ->name('app.bookkeeping.transactions.confirm');

    Route::get('bookkeeping/transactions/set-counter-account/',
        TransactionSetCounterAccountController::class)
        ->name('app.bookkeeping.transactions.set-counter-account');


    Route::get('bookkeeping/bookings',
        BookingIndexController::class)->name('app.bookkeeping.bookings.index');

    Route::get('bookkeeping/transactions/{bank_account?}',
        TransactionIndexController::class)->name('app.bookkeeping.transactions.index');

    Route::post('bookkeeping/transactions/money-money-import',
        TransactionMoneyMoneyImportController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.bookkeeping.transactions.money-money-import');

    Route::get('bookkeeping/transactions/{transaction}/pay-invoice',
        TransactionPayInvoiceCreateController::class)->name('app.bookkeeping.transactions.pay-invoice');

    Route::get('contacts/create',
        ContactCreateController::class)->name('app.contact.create');

    Route::post('contacts/store',
        ContactStoreController::class)->name('app.contact.store')->middleware([HandlePrecognitiveRequests::class]);

    Route::get('contacts/{contact}',
        ContactDetailsController::class)->name('app.contact.details');

    Route::get('contacts/{contact}/edit',
        ContactEditController::class)->name('app.contact.edit');

    Route::put('contacts/{contact}/edit',
        ContactUpdateController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.contact.update');


    Route::get('contacts/{contact}/persons',
        ContactDetailsPersonsController::class)->name('app.contact.details.persons');

    Route::get('contacts/{contact}/{address}/edit',
        ContactEditAddressController::class)->name('app.contact.edit.address');

    Route::get('contacts/{contact}/create',
        ContactAddressCreateController::class)->name('app.contact.create.address');

    Route::put('contacts/{contact}/toggle-favorite',
        ContactToggleFavoriteController::class)->name('app.contact.toggle-favorite');

    Route::put('contacts/{contact}/{contact_address}',
        ContactAddressUpdateController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.contact.address.update');

    Route::post('contacts/{contact}/address',
        ContactAddressStoreController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.contact.address.store');

    Route::get('invoicing/invoices/create',
        InvoiceCreateController::class)->name('app.invoice.create');

    Route::get('invoicing/invoices',
        InvoiceIndexController::class)->name('app.invoice.index');

    Route::get('invoicing/invoices/{invoice}',
        InvoiceDetailsController::class)->name('app.invoice.details');

    Route::get('invoicing/invoices/{invoice}/link-on-account-invoice',
        InvoiceDetailsAddOnAccountInvoiceController::class)->name('app.invoice.link-on-account-invoice');

    Route::post('invoicing/invoices/{invoice}/store-on-account-invoice',
        InvoiceDetailsStoreOnAccountInvoiceController::class)->name('app.invoice.link-on-account-store');

    Route::get('invoicing/invoices/{invoice}/payments',
        InvoicePaymentCreateController::class)->name('app.invoice.create.payment');

    Route::get('invoicing/invoices/{invoice}/payments/store',
        InvoicePaymentStoreController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.invoice.store.payment');

    Route::get('invoicing/invoices/{invoice}/history',
        InvoiceHistoryController::class)->name('app.invoice.history');

    Route::post('invoicing/invoices',
        InvoiceStoreController::class)
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.invoice.store');

    Route::delete('invoicing/invoices/{invoice}',
        InvoiceDeleteController::class)->name('app.invoice.delete');

    Route::get('invoicing/invoices/{invoice}/base-edit',
        InvoiceDetailsEditBaseController::class)->name('app.invoice.base-edit');

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
