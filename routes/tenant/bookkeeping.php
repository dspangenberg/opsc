<?php

declare(strict_types=1);

use App\Http\Controllers\App\Bookkeeping\BookingController;
use App\Http\Controllers\App\Bookkeeping\BookkeepingAcountsController;
use App\Http\Controllers\App\Bookkeeping\BookkeepingRulesController;
use App\Http\Controllers\App\Bookkeeping\CostCenterController;
use App\Http\Controllers\App\Bookkeeping\ReceiptController;
use App\Http\Controllers\App\Bookkeeping\TransactionController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Bookkeeping
Route::get('bookkeeping/transactions/confirm/', [TransactionController::class, 'confirm'])
    ->name('app.bookkeeping.transactions.confirm');

Route::get('bookkeeping/transactions/set-counter-account/', [TransactionController::class, 'setCounterAccount'])
    ->name('app.bookkeeping.transactions.set-counter-account');

Route::get('bookkeeping/bookings', [BookingController::class, 'index'])
    ->name('app.bookkeeping.bookings.index');

Route::get('bookkeeping/bookings/export', [BookingController::class, 'exportCSV'])
    ->name('app.bookkeeping.bookings.export');

Route::post('bookkeeping/transactions/money-money-import', [TransactionController::class, 'moneyMoneyImport'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.transactions.money-money-import');

Route::post('bookkeeping/transactions/holvi-import', [TransactionController::class, 'holviImport'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.transactions.holvi-import');

Route::match(['GET', 'POST'], 'bookkeeping/transactions/{bank_account?}', [TransactionController::class, 'index'])
    ->name('app.bookkeeping.transactions.index');

Route::post('/bookkeeping/receipts/upload', [ReceiptController::class, 'upload'])->name('app.bookkeeping.receipts.upload')->middleware([HandlePrecognitiveRequests::class]);
Route::get('/bookkeeping/receipts/upload-form', [ReceiptController::class, 'uploadForm'])->name('app.bookkeeping.receipts.upload-form');
Route::get('/bookkeeping/receipts', [ReceiptController::class, 'index'])->name('app.bookkeeping.receipts.index');

Route::get('/bookkeeping/receipts/lock/', [ReceiptController::class, 'lock'])->name('app.bookkeeping.receipts.lock');
Route::get('/bookkeeping/receipts/rule/', [ReceiptController::class, 'runRules'])->name('app.bookkeeping.receipts.rule');

Route::get('/bookkeeping/receipts/confirm/', [ReceiptController::class, 'confirmFirst'])->name('app.bookkeeping.receipts.confirm-first');
Route::put('/bookkeeping/receipts/confirm/{receipt}/update', [ReceiptController::class, 'update'])->name('app.bookkeeping.receipts.update')->middleware([HandlePrecognitiveRequests::class]);
Route::get('/bookkeeping/receipts/{receipt}/pdf', [ReceiptController::class, 'streamPdf'])->name('app.bookkeeping.receipts.pdf');
Route::delete('/bookkeeping/receipts/{receipt}/delete', [ReceiptController::class, 'destroy'])->name('app.bookkeeping.receipts.destroy');
Route::get('/bookkeeping/receipts/{receipt}/payments', [ReceiptController::class, 'createPayments'])->name('app.bookkeeping.receipts.payments');
Route::get('/bookkeeping/receipts/{receipt}/payments-store', [ReceiptController::class, 'storePayments'])->name('app.bookkeeping.receipts.payments-store');

Route::get('/bookkeeping/receipts/confirm/{receipt}', [ReceiptController::class, 'confirm'])->name('app.bookkeeping.receipts.confirm');
Route::get('/bookkeeping/receipts/{receipt}/edit', [ReceiptController::class, 'edit'])->name('app.bookkeeping.receipts.edit');
Route::get('/bookkeeping/receipts/bulk-download/', [ReceiptController::class, 'bulkDownload'])->name('app.bookkeeping.bulk-download');
