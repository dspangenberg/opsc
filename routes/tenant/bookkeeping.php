<?php

declare(strict_types=1);

use App\Http\Controllers\App\Bookkeeping\Booking\BookingIndexController;
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

Route::get('bookkeeping/transactions/{bank_account?}', TransactionIndexController::class)
    ->name('app.bookkeeping.transactions.index');

Route::post('bookkeeping/transactions/money-money-import', TransactionMoneyMoneyImportController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.transactions.money-money-import');

Route::get('bookkeeping/transactions/{transaction}/pay-invoice', TransactionPayInvoiceCreateController::class)
    ->name('app.bookkeeping.transactions.pay-invoice');
