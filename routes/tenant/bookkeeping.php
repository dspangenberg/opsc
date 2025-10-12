<?php

declare(strict_types=1);

use App\Http\Controllers\App\Bookkeeping\Booking\BookingExportCSV;
use App\Http\Controllers\App\Bookkeeping\Booking\BookingIndexController;
use App\Http\Controllers\App\Bookkeeping\BookkeepingAcountsController;
use App\Http\Controllers\App\Bookkeeping\BookkeepingRulesController;
use App\Http\Controllers\App\Bookkeeping\CostCenterController;
use App\Http\Controllers\App\Bookkeeping\ReceiptController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionConfirmController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionHolviImportController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionIndexController;
use App\Http\Controllers\App\Bookkeeping\Transaction\TransactionMoneyMoneyImportController;
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

Route::get('bookkeeping/bookings/export', BookingExportCSV::class)
    ->name('app.bookkeeping.bookings.export');


Route::post('bookkeeping/transactions/money-money-import', TransactionMoneyMoneyImportController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.transactions.money-money-import');

Route::post('bookkeeping/transactions/holvi-import', TransactionHolviImportController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.transactions.holvi-import');

Route::match(['GET', 'POST'], 'bookkeeping/transactions/{bank_account?}', TransactionIndexController::class)
    ->name('app.bookkeeping.transactions.index');






Route::post('/bookkeeping/receipts/upload', [ReceiptController::class, 'upload'])->name('app.bookkeeping.receipts.upload')->middleware([HandlePrecognitiveRequests::class]);
Route::get('/bookkeeping/receipts/upload-form', [ReceiptController::class,'uploadForm'])->name('app.bookkeeping.receipts.upload-form');
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


Route::get('/bookkeeping/preferences/accounts', [BookkeepingAcountsController::class, 'index'])->name('app.bookkeeping.accounts.index');


Route::get('/bookkeeping/preferences/rules', [BookkeepingRulesController::class, 'index'])->name('app.bookkeeping.rules.index');
Route::get('/bookkeeping/preferences/rules/{rule}/edit', [BookkeepingRulesController::class, 'edit'])->name('app.bookkeeping.rules.edit');

Route::put('/bookkeeping/preferences/rules/{rule}/update', [BookkeepingRulesController::class, 'update'])->name('app.bookkeeping.rules.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('/bookkeeping/preferences/rules/{rule}', [BookkeepingRulesController::class, 'destroy'])->name('app.bookkeeping.rules.destroy');
Route::get('/bookkeeping/preferences/rules/create', [BookkeepingRulesController::class, 'create'])->name('app.bookkeeping.rules.create');
Route::post('/bookkeeping/preferences/rules/store', [BookkeepingRulesController::class, 'store'])->name('app.bookkeeping.rules.store')->middleware([HandlePrecognitiveRequests::class]);


Route::get('/bookkeeping/preferences/cost-centers', [CostCenterController::class, 'index'])->name('app.bookkeeping.cost-centers.index');
Route::get('/bookkeeping/preferences/cost-centers/create', [CostCenterController::class, 'create'])->name('app.bookkeeping.cost-centers.create');

Route::post('/bookkeeping/preferences/cost-centers', [CostCenterController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.cost-centers.store');


Route::get('/bookkeeping/preferences/cost-centers/{costCenter}/edit', [CostCenterController::class, 'edit'])->name('app.bookkeeping.cost-centers.edit')->middleware([HandlePrecognitiveRequests::class]);
Route::put('/bookkeeping/preferences/cost-centers/{costCenter}/edit', [CostCenterController::class, 'update'])->name('app.bookkeeping.cost-centers.update');
