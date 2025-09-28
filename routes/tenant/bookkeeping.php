<?php

declare(strict_types=1);

use App\Http\Controllers\App\Bookkeeping\Booking\BookingIndexController;
use App\Http\Controllers\App\Bookkeeping\CostCenterController;
use App\Http\Controllers\App\Bookkeeping\ReceiptController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionConfirmController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionIndexController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionMoneyMoneyImportController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionPayInvoiceCreateController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionSetCounterAccountController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Bookkeeping
Route::get('bookkeeping/transactions/confirm/', TransactionConfirmController::class)
    ->name('app.bookkeeping.transactions.confirm');

Route::get('bookkeeping/transactions/set-counter-account/', TransactionSetCounterAccountController::class)
    ->name('app.bookkeeping.transactions.set-counter-account');

Route::get('bookkeeping/bookings', BookingIndexController::class)
    ->name('app.bookkeeping.bookings.index');

Route::match(['GET', 'POST'], 'bookkeeping/transactions/{bank_account?}', TransactionIndexController::class)
    ->name('app.bookkeeping.transactions.index');


Route::post('bookkeeping/transactions/money-money-import', TransactionMoneyMoneyImportController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.transactions.money-money-import');


Route::get('/bookkeeping/receipts', [ReceiptController::class, 'index'])->name('app.bookkeeping.receipts.index');
Route::post('/bookkeeping/receipts/upload', [ReceiptController::class, 'upload'])->name('app.bookkeeping.receipts.upload')->middleware([HandlePrecognitiveRequests::class]);

Route::get('/bookkeeping/receipts/confirm/', [ReceiptController::class, 'confirmFirst'])->name('app.bookkeeping.receipts.confirm-first');
Route::put('/bookkeeping/receipts/confirm/{receipt}/update', [ReceiptController::class, 'update'])->name('app.bookkeeping.receipts.update')->middleware([HandlePrecognitiveRequests::class]);;
Route::get('/bookkeeping/receipts/{receipt}/pdf', [ReceiptController::class, 'streamPdf'])->name('app.bookkeeping.receipts.pdf');
Route::delete('/bookkeeping/receipts/{receipt}/delete', [ReceiptController::class, 'destroy'])->name('app.bookkeeping.receipts.destroy');


Route::get('/bookkeeping/receipts/confirm/{receipt}', [ReceiptController::class, 'confirm'])->name('app.bookkeeping.receipts.confirm');




Route::get('/bookkeeping/preferences/cost-centers', [CostCenterController::class, 'index'])->name('app.bookkeeping.cost-centers.index');
Route::get('/bookkeeping/preferences/cost-centers/create', [CostCenterController::class, 'create'])->name('app.bookkeeping.cost-centers.create');

Route::post('/bookkeeping/preferences/cost-centers', [CostCenterController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.cost-centers.store');


Route::get('/bookkeeping/preferences/cost-centers/{costCenter}/edit', [CostCenterController::class, 'edit'])->name('app.bookkeeping.cost-centers.edit')->middleware([HandlePrecognitiveRequests::class]);
Route::put('/bookkeeping/preferences/cost-centers/{costCenter}/edit', [CostCenterController::class, 'update'])->name('app.bookkeeping.cost-centers.update');
