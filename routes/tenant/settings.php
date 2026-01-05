<?php

declare(strict_types=1);
use App\Http\Controllers\App\OfferController;
use App\Http\Controllers\App\OfferSectionController;
use App\Http\Controllers\App\TextModuleController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('settings/text-modules', [TextModuleController::class, 'index'])->name('app.setting.text-module.index');
Route::get('settings/text-modules/create', [TextModuleController::class, 'create'])->name('app.setting.text-module.create');
Route::post('settings/text-modules/store', [TextModuleController::class, 'store'])->name('app.setting.text-module.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/text-modules/store/{module}', [TextModuleController::class, 'edit'])->name('app.setting.text-module.edit');
Route::put('settings/text-modules/store/{module}', [TextModuleController::class, 'update'])->name('app.setting.text-module.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/text-modules/{module}', [TextModuleController::class, 'delete'])->name('app.setting.text-module.delete');
