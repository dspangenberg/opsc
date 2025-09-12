<?php

declare(strict_types=1);

use App\Http\Controllers\App\Time\TimeCreateController;
use App\Http\Controllers\App\Time\TimeDeleteController;
use App\Http\Controllers\App\Time\TimeEditController;
use App\Http\Controllers\App\Time\TimeIndexController;
use App\Http\Controllers\App\Time\TimeMyWeekIndexController;
use App\Http\Controllers\App\Time\TimePdfReportController;
use App\Http\Controllers\App\Time\TimeStoreController;
use App\Http\Controllers\App\Time\TimeUpateController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Times
Route::get('times/create', TimeCreateController::class)->name('app.time.create');

Route::post('times', TimeStoreController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.time.store');

Route::get('times/all', TimeIndexController::class)->name('app.time.index');

Route::get('times/my-week', TimeMyWeekIndexController::class)->name('app.time.my-week');

Route::get('times/{time}/edit', TimeEditController::class)->name('app.time.edit');

Route::put('times/{time}', TimeUpateController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.time.update');

Route::get('times/pdf', TimePdfReportController::class)->name('app.time.pdf');

Route::delete('times/{time}', TimeDeleteController::class)->name('app.times.delete');
