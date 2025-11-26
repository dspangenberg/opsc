<?php

declare(strict_types=1);

use App\Http\Controllers\App\TimeController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Times
Route::get('times/create', [TimeController::class, 'create'])->name('app.time.create');

Route::post('times', [TimeController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.time.store');

Route::get('times/all', [TimeController::class, 'index'])->name('app.time.index');

Route::get('times/my-week', [TimeController::class, 'myWeek'])->name('app.time.my-week');
Route::get('times/bill', [TimeController::class, 'storeBill'])->name('app.time.bill');

Route::get('times/{time}/edit', [TimeController::class, 'edit'])->name('app.time.edit');

Route::put('times/{time}', [TimeController::class, 'update'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.time.update');

Route::get('times/pdf', [TimeController::class, 'pdfReport'])->name('app.time.pdf');

Route::delete('times/{time}', [TimeController::class, 'destroy'])->name('app.times.delete');
