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

Route::get('settings/offer-sections', [OfferSectionController::class, 'index'])->name('app.settings.offer-section.index');
Route::get('settings/offer-sections/create', [OfferSectionController::class, 'create'])->name('app.settings.offer-section.create');
Route::post('settings/offer-sections/store', [OfferSectionController::class, 'store'])->name('app.settings.offer-section.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/offer-sections/{section}', [OfferSectionController::class, 'edit'])->name('app.settings.offer-section.edit');
Route::put('settings/offer-sections/{section}', [OfferSectionController::class, 'update'])->name('app.settings.offer-section.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/offer-sections/{section}', [OfferSectionController::class, 'delete'])->name('app.settings.offer-section.delete');
