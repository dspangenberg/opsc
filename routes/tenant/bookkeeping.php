<?php

declare(strict_types=1);

use App\Http\Controllers\App\Bookkeeping\BookingController;
use App\Http\Controllers\App\Bookkeeping\ReceiptController;
use App\Http\Controllers\App\Bookkeeping\TransactionController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Bookkeeping
Route::put('bookkeeping/transactions/confirm/{transaction?}', [TransactionController::class, 'confirm'])
    ->name('app.bookkeeping.transactions.confirm');

Route::put('bookkeeping/transactions/{transaction}/unconfirm/', [TransactionController::class, 'unconfirm'])
    ->name('app.bookkeeping.transactions.unconfirm');

Route::put('bookkeeping/transactions/run-rules/', [TransactionController::class, 'runRules'])
    ->name('app.bookkeeping.transactions.run-rules');

Route::put('bookkeeping/transactions/set-counter-account/', [TransactionController::class, 'setCounterAccount'])
    ->name('app.bookkeeping.transactions.set-counter-account');

Route::match(['GET', 'POST'], 'bookkeeping/bookings', [BookingController::class, 'index'])
    ->name('app.bookkeeping.bookings.index');

Route::match(['GET', 'POST'], 'bookkeeping/accounts-overview', [BookingController::class, 'accountsOverview'])
    ->name('app.bookkeeping.accounts.overview');

Route::get('bookkeeping/bookings/export', [BookingController::class, 'exportCSV'])
    ->name('app.bookkeeping.bookings.export');

Route::put('bookkeeping/bookings/{booking}/cancel', [BookingController::class, 'cancellation'])
    ->name('app.bookkeeping.bookings.cancel');

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
Route::match(['GET', 'POST'], '/bookkeeping/receipts', [ReceiptController::class, 'index'])->name('app.bookkeeping.receipts.index');
Route::get('/bookkeeping/receipts/report', [ReceiptController::class, 'printReport'])->name('app.bookkeeping.receipts.print');

Route::put('/bookkeeping/receipts/lock/{receipt?}', [ReceiptController::class, 'lock'])->name('app.bookkeeping.receipts.lock');
Route::put('/bookkeeping/receipts/rule/', [ReceiptController::class, 'runRules'])->name('app.bookkeeping.receipts.rule');

Route::get('/bookkeeping/receipts/confirm/', [ReceiptController::class, 'confirmFirst'])->name('app.bookkeeping.receipts.confirm-first');
Route::put('/bookkeeping/receipts/confirm/{receipt}/update', [ReceiptController::class, 'update'])->name('app.bookkeeping.receipts.update')->middleware([HandlePrecognitiveRequests::class]);
Route::get('/bookkeeping/receipts/{receipt}/pdf', [ReceiptController::class, 'streamPdf'])->name('app.bookkeeping.receipts.pdf');
Route::delete('/bookkeeping/receipts/{receipt}/delete', [ReceiptController::class, 'destroy'])->name('app.bookkeeping.receipts.destroy');
Route::get('/bookkeeping/receipts/{receipt}/payments', [ReceiptController::class, 'createPayments'])->name('app.bookkeeping.receipts.payments');
Route::get('/bookkeeping/receipts/{receipt}/payments-store', [ReceiptController::class, 'storePayments'])->name('app.bookkeeping.receipts.payments-store');

Route::get('/bookkeeping/receipts/confirm/{receipt}', [ReceiptController::class, 'confirm'])->name('app.bookkeeping.receipts.confirm');
Route::get('/bookkeeping/receipts/{receipt}/edit', [ReceiptController::class, 'edit'])->name('app.bookkeeping.receipts.edit');
Route::get('/bookkeeping/receipts/bulk-download/', [ReceiptController::class, 'bulkDownload'])->name('app.bookkeeping.bulk-download');
Route::put('/bookkeeping/receipts/{receipt}/unlock', [ReceiptController::class, 'unlock'])->name('app.bookkeeping.receipts.unlock');
Route::delete('/bookkeeping/receipts/{receipt}/payment/{transaction}', [ReceiptController::class, 'destroyPayment'])->name('app.bookkeeping.receipts.delete-payment');

Route::match(['GET', 'POST'],'bookkeeping/bookings/account/{accountNumber}', [BookingController::class, 'indexForAccount'])->name('app.bookkeeping.bookings.account');
Route::put('bookkeeping/bookings/correct', [BookingController::class, 'correctBookings'])
    ->name('app.bookkeeping.bookings.correct');

Route::put('bookkeeping/bookings/confirm', [BookingController::class, 'confirm'])
    ->name('app.bookkeeping.bookings.confirm');

Route::delete('bookkeeping/receipts/bulk-delete', [ReceiptController::class, 'bulkDelete'])
    ->name('app.bookkeeping.receipts.bulk-delete');

Route::put('bookkeeping/bookings/{booking}/edit-accounts', [BookingController::class, 'editAccounts'])
   ->middleware([HandlePrecognitiveRequests::class])->name('app.bookkeeping.bookings.edit-accounts');

Route::get('bookkeeping/receipts/check-reference/{reference}', [ReceiptController::class, 'checkReference'])->name('app.bookkeeping.receipts.check-reference');
