<?php

declare(strict_types=1);

use App\Http\Controllers\App\InvoiceController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Invoices
Route::get('invoicing/invoices/create', [InvoiceController::class, 'create'])
    ->name('app.invoice.create');

Route::get('invoicing/invoices', [InvoiceController::class, 'index'])
    ->name('app.invoice.index');

Route::get('invoicing/invoices/{invoice}', [InvoiceController::class, 'show'])
    ->name('app.invoice.details');

Route::get('invoicing/invoices/{invoice}/link-on-account-invoice', [InvoiceController::class, 'addOnAccountInvoice'])
    ->name('app.invoice.link-on-account-invoice');

Route::post('invoicing/invoices/{invoice}/store-on-account-invoice', [InvoiceController::class, 'storeOnAccountInvoice'])
    ->name('app.invoice.link-on-account-store');

Route::get('invoicing/invoices/{invoice}/payments', [InvoiceController::class, 'createPayment'])
    ->name('app.invoice.create.payment');

Route::get('invoicing/invoices/{invoice}/payments/store', [InvoiceController::class, 'storePayment'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.invoice.store.payment');

Route::get('invoicing/invoices/{invoice}/history', [InvoiceController::class, 'history'])
    ->name('app.invoice.history');

Route::post('invoicing/invoices', [InvoiceController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.invoice.store');

Route::delete('invoicing/invoices/{invoice}', [InvoiceController::class, 'destroy'])
    ->name('app.invoice.delete');

Route::get('invoicing/invoices/{invoice}/base-edit', [InvoiceController::class, 'edit'])
    ->name('app.invoice.base-edit');

Route::get('invoicing/invoices/{invoice}/unrelease', [InvoiceController::class, 'unrelease'])
    ->name('app.invoice.unrelease');

Route::get('invoicing/invoices/{invoice}/release', [InvoiceController::class, 'release'])
    ->name('app.invoice.release');

Route::get('invoicing/invoices/{invoice}/mark-as-sent', [InvoiceController::class, 'markAsSent'])
    ->name('app.invoice.mark-as-sent');

Route::get('invoicing/invoices/{invoice}/line-duplicate/{invoiceLine}', [InvoiceController::class, 'duplicateLine'])
    ->name('app.invoice.line-duplicate')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/line-create', [InvoiceController::class, 'createLine'])
    ->name('app.invoice.line-create')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/line-edit/{invoiceLine}', [InvoiceController::class, 'editLine'])
    ->name('app.invoice.line-edit')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::put('invoicing/invoices/{invoice}/line-update/{invoiceLine}', [InvoiceController::class, 'updateLine'])
    ->name('app.invoice.line-update')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::post('invoicing/invoices/{invoice}/line-update/store', [InvoiceController::class, 'storeLine'])
    ->name('app.invoice.line-store')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/create_booking', [InvoiceController::class, 'createBooking'])
    ->name('app.invoice.booking-create');

Route::delete('invoicing/invoices/{invoice}/line-delete/{invoiceLine}', [InvoiceController::class, 'deleteLine'])
    ->name('app.invoice.line-delete')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::put('invoicing/invoices/{invoice}/base-update', [InvoiceController::class, 'update'])
    ->name('app.invoice.base-update')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/duplicate', [InvoiceController::class, 'duplicate'])
    ->name('app.invoice.duplicate')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/invoices/{invoice}/pdf', [InvoiceController::class, 'downloadPdf'])
    ->name('app.invoice.pdf');
