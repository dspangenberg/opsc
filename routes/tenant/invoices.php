<?php

declare(strict_types=1);

use App\Http\Controllers\App\Invoice\InvoiceCreateBookingController;
use App\Http\Controllers\App\Invoice\InvoiceCreateController;
use App\Http\Controllers\App\Invoice\InvoiceDeleteController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsAddOnAccountInvoiceController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsController;
use App\Http\Controllers\App\Invoice\InvoiceEditBaseDataController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsStoreOnAccountInvoiceController;
use App\Http\Controllers\App\Invoice\InvoiceDetailsUpdateBaseController;
use App\Http\Controllers\App\Invoice\InvoiceDuplicateController;
use App\Http\Controllers\App\Invoice\InvoiceHistoryController;
use App\Http\Controllers\App\Invoice\InvoiceIndexController;
use App\Http\Controllers\App\Invoice\InvoiceLineCreateController;
use App\Http\Controllers\App\Invoice\InvoiceLineDeleteController;
use App\Http\Controllers\App\Invoice\InvoiceLineDuplicateController;
use App\Http\Controllers\App\Invoice\InvoiceLineEditController;
use App\Http\Controllers\App\Invoice\InvoiceLineStoreController;
use App\Http\Controllers\App\Invoice\InvoiceLineUpdateController;
use App\Http\Controllers\App\Invoice\InvoiceMarkAsSentController;
use App\Http\Controllers\App\Invoice\InvoicePaymentCreateController;
use App\Http\Controllers\App\Invoice\InvoicePaymentStoreController;
use App\Http\Controllers\App\Invoice\InvoicePdfDownloadController;
use App\Http\Controllers\App\Invoice\InvoiceReleaseController;
use App\Http\Controllers\App\Invoice\InvoiceStoreController;
use App\Http\Controllers\App\Invoice\InvoiceUnreleaseController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Invoices
Route::get('invoicing/invoices/create', InvoiceCreateController::class)
    ->name('app.invoice.create');

Route::get('invoicing/invoices', InvoiceIndexController::class)
    ->name('app.invoice.index');

Route::get('invoicing/invoices/{invoice}', InvoiceDetailsController::class)
    ->name('app.invoice.details');

Route::get('invoicing/invoices/{invoice}/link-on-account-invoice', InvoiceDetailsAddOnAccountInvoiceController::class)
    ->name('app.invoice.link-on-account-invoice');

Route::post('invoicing/invoices/{invoice}/store-on-account-invoice', InvoiceDetailsStoreOnAccountInvoiceController::class)
    ->name('app.invoice.link-on-account-store');

Route::get('invoicing/invoices/{invoice}/payments', InvoicePaymentCreateController::class)
    ->name('app.invoice.create.payment');

Route::get('invoicing/invoices/{invoice}/payments/store', InvoicePaymentStoreController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.invoice.store.payment');

Route::get('invoicing/invoices/{invoice}/history', InvoiceHistoryController::class)
    ->name('app.invoice.history');

Route::post('invoicing/invoices', InvoiceStoreController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.invoice.store');

Route::delete('invoicing/invoices/{invoice}', InvoiceDeleteController::class)
    ->name('app.invoice.delete');

Route::get('invoicing/invoices/{invoice}/base-edit', InvoiceEditBaseDataController::class)
    ->name('app.invoice.base-edit');

Route::get('invoicing/invoices/{invoice}/unrelease', InvoiceUnreleaseController::class)
    ->name('app.invoice.unrelease');

Route::get('invoicing/invoices/{invoice}/release', InvoiceReleaseController::class)
    ->name('app.invoice.release');

Route::get('invoicing/invoices/{invoice}/mark-as-sent', InvoiceMarkAsSentController::class)
    ->name('app.invoice.mark-as-sent');

Route::get('invoicing/invoices/{invoice}/line-duplicate/{invoiceLine}', InvoiceLineDuplicateController::class)
    ->name('app.invoice.line-duplicate')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/line-create', InvoiceLineCreateController::class)
    ->name('app.invoice.line-create')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/line-edit/{invoiceLine}', InvoiceLineEditController::class)
    ->name('app.invoice.line-edit')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::put('invoicing/invoices/{invoice}/line-update/{invoiceLine}', InvoiceLineUpdateController::class)
    ->name('app.invoice.line-update')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::post('invoicing/invoices/{invoice}/line-update/store', InvoiceLineStoreController::class)
    ->name('app.invoice.line-store')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/create_booking', InvoiceCreateBookingController::class)
    ->name('app.invoice.booking-create');







Route::delete('invoicing/invoices/{invoice}/line-delete/{invoiceLine}', InvoiceLineDeleteController::class)
    ->name('app.invoice.line-delete')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::put('invoicing/invoices/{invoice}/base-update', InvoiceDetailsUpdateBaseController::class)
    ->name('app.invoice.base-update')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/duplicate', InvoiceDuplicateController::class)
    ->name('app.invoice.duplicate')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/pdf', InvoicePdfDownloadController::class)
    ->name('app.invoice.pdf');
