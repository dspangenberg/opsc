<?php

declare(strict_types=1);

use App\Http\Controllers\App\OfferSectionController;
use App\Http\Controllers\App\Setting\LetterheadController;
use App\Http\Controllers\App\Setting\PrintLayoutController;
use App\Http\Controllers\App\Setting\TextModuleController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('settings/offers/text-modules', [TextModuleController::class, 'index'])->name('app.setting.text-module.index');
Route::get('settings/offers/text-modules/create', [TextModuleController::class, 'create'])->name('app.setting.text-module.create');
Route::post('settings/offers/text-modules/store', [TextModuleController::class, 'store'])->name('app.setting.text-module.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/offers/text-modules/store/{module}', [TextModuleController::class, 'edit'])->name('app.setting.text-module.edit');
Route::put('settings/offers/text-modules/store/{module}', [TextModuleController::class, 'update'])->name('app.setting.text-module.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/offers/text-modules/{module}', [TextModuleController::class, 'delete'])->name('app.setting.text-module.delete');


Route::redirect('settings/offers', '/app/settings/offers/offer-sections')->name('app.setting.offer');

Route::get('settings/offers/offer-sections', [OfferSectionController::class, 'index'])->name('app.settings.offer-section.index');
Route::get('settings/offers/offer-sections/create', [OfferSectionController::class, 'create'])->name('app.settings.offer-section.create');
Route::post('settings/offers/offer-sections/store', [OfferSectionController::class, 'store'])->name('app.settings.offer-section.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/offers/offer-sections/{section}', [OfferSectionController::class, 'edit'])->name('app.settings.offer-section.edit');
Route::put('settings/offers/offer-sections/{section}', [OfferSectionController::class, 'update'])->name('app.settings.offer-section.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/offers/offer-sections/{section}', [OfferSectionController::class, 'delete'])->name('app.settings.offer-section.delete');

Route::get('settings/printing-system/global-css', [LetterheadController::class, 'editGlobalCSS'])->name('app.setting.global-css-edit');
Route::put('settings/printing-system/global-css', [LetterheadController::class, 'updateGlobalCSS'])->name('app.setting.global-css-update')->middleware([HandlePrecognitiveRequests::class]);

Route::redirect('settings', '/app/settings/offers')->name('app.setting');
Route::redirect('settings/printing-system', '/app/settings/printing-system/global-css')->name('app.setting.printing-system');

Route::get('settings/printing-system/letterheads', [LetterheadController::class, 'index'])->name('app.setting.letterhead.index');
Route::get('settings/printing-system/letterheads/create', [LetterheadController::class, 'create'])->name('app.setting.letterhead.create');
Route::post('settings/printing-system/letterheads/store', [LetterheadController::class, 'store'])->name('app.setting.letterhead.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/printing-system/letterheads/{letterhead}/edit', [LetterheadController::class, 'edit'])->name('app.setting.letterhead.edit');
Route::put('settings/printing-system/letterheads/{letterhead}', [LetterheadController::class, 'update'])->name('app.setting.letterhead.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/printing-system/letterheads/{letterhead}', [LetterheadController::class, 'delete'])->name('app.setting.letterhead.delete');

Route::get('settings/printing-system/layouts', [PrintLayoutController::class, 'index'])->name('app.setting.layout.index');
Route::get('settings/printing-system/layouts/create', [PrintLayoutController::class, 'create'])->name('app.setting.layout.create');
Route::post('settings/printing-system/layouts/store', [PrintLayoutController::class, 'store'])->name('app.setting.layout.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/printing-system/layouts/{layout}/edit', [PrintLayoutController::class, 'edit'])->name('app.setting.layout.edit');
Route::put('settings/printing-system/layouts/{layout}', [PrintLayoutController::class, 'update'])->name('app.setting.layout.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/printing-system/layouts/{layout}', [PrintLayoutController::class, 'delete'])->name('app.setting.layout.delete');
