<?php

declare(strict_types=1);

use App\Http\Controllers\App\Bookkeeping\BookkeepingAcountsController;
use App\Http\Controllers\App\Bookkeeping\BookkeepingRulesController;
use App\Http\Controllers\App\Bookkeeping\CostCenterController;
use App\Http\Controllers\App\Setting\DocumentTypeController;
use App\Http\Controllers\App\Setting\LetterheadController;
use App\Http\Controllers\App\Setting\OfferSectionController;
use App\Http\Controllers\App\Setting\PrintLayoutController;
use App\Http\Controllers\App\Setting\TextModuleController;
use App\Http\Controllers\App\Setting\UserController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('settings/offers/text-modules', [TextModuleController::class, 'index'])->name('app.setting.text-module.index');
Route::get('settings/offers/text-modules/create', [TextModuleController::class, 'create'])->name('app.setting.text-module.create');
Route::post('settings/offers/text-modules/store', [TextModuleController::class, 'store'])->name('app.setting.text-module.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/offers/text-modules/{module}', [TextModuleController::class, 'edit'])->name('app.setting.text-module.edit');
Route::put('settings/offers/text-modules/{module}', [TextModuleController::class, 'update'])->name('app.setting.text-module.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/offers/text-modules/{module}', [TextModuleController::class, 'delete'])->name('app.setting.text-module.delete');


Route::redirect('settings/offers', '/app/settings/offers/offer-sections')->name('app.setting.offer');

Route::get('settings/offers/offer-sections', [OfferSectionController::class, 'index'])->name('app.setting.offer-section.index');
Route::get('settings/offers/offer-sections/create', [OfferSectionController::class, 'create'])->name('app.setting.offer-section.create');
Route::post('settings/offers/offer-sections/store', [OfferSectionController::class, 'store'])->name('app.setting.offer-section.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('settings/offers/offer-sections/{section}', [OfferSectionController::class, 'edit'])->name('app.setting.offer-section.edit');
Route::put('settings/offers/offer-sections/{section}', [OfferSectionController::class, 'update'])->name('app.setting.offer-section.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('settings/offers/offer-sections/{section}', [OfferSectionController::class, 'delete'])->name('app.setting.offer-section.delete');

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

Route::get('/settings/documents/document-types', [DocumentTypeController::class, 'index'])->name('app.setting.document_type.index');
Route::get('/settings/documents/document-types/create', [DocumentTypeController::class, 'create'])->name('app.setting.document_type.create');

Route::post('/settings/documents/document-types', [DocumentTypeController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.setting.document_type.store');

Route::get('/settings/documents/document-types/{documentType}/edit', [DocumentTypeController::class, 'edit'])->name('app.setting.document_type.edit')->middleware([HandlePrecognitiveRequests::class]);
Route::put('/settings/documents/document-types/{documentType}/edit', [DocumentTypeController::class, 'update'])->name('app.setting.document_type.update')->middleware([HandlePrecognitiveRequests::class]);


Route::redirect('settings/bookkeeping', '/app/settings/bookkeeping/accounts')->name('app.setting.bookkeeping');
Route::get('/settings/bookkeeping/accounts', [BookkeepingAcountsController::class, 'index'])->name('app.bookkeeping.accounts.index');

Route::get('/settings/bookkeeping/rules', [BookkeepingRulesController::class, 'index'])->name('app.bookkeeping.rules.index');
Route::get('/settings/bookkeeping/rules/{rule}/edit', [BookkeepingRulesController::class, 'edit'])->name('app.bookkeeping.rules.edit');

Route::put('/settings/bookkeeping/rules/{rule}/update', [BookkeepingRulesController::class, 'update'])->name('app.bookkeeping.rules.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('/settings/bookkeeping/rules/{rule}', [BookkeepingRulesController::class, 'destroy'])->name('app.bookkeeping.rules.destroy');
Route::get('/settings/bookkeeping/rules/create', [BookkeepingRulesController::class, 'create'])->name('app.bookkeeping.rules.create');
Route::post('/settings/bookkeeping/rules/store', [BookkeepingRulesController::class, 'store'])->name('app.bookkeeping.rules.store')->middleware([HandlePrecognitiveRequests::class]);

Route::get('/settings/bookkeeping/cost-centers', [CostCenterController::class, 'index'])->name('app.bookkeeping.cost-centers.index');
Route::get('/settings/bookkeeping/cost-centers/create', [CostCenterController::class, 'create'])->name('app.bookkeeping.cost-centers.create');

Route::post('/settings/bookkeeping/cost-centers', [CostCenterController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.bookkeeping.cost-centers.store');

Route::get('/settings/bookkeeping/cost-centers/{costCenter}/edit', [CostCenterController::class, 'edit'])->name('app.bookkeeping.cost-centers.edit')->middleware([HandlePrecognitiveRequests::class]);
Route::put('/settings/bookkeeping/cost-centers/{costCenter}/edit', [CostCenterController::class, 'update'])->name('app.bookkeeping.cost-centers.update');

Route::get('/profile/password', [ProfileController::class, 'editPassword'])->name('app.profile.change-password')->middleware([HandlePrecognitiveRequests::class]);
Route::put('/profile/password', [ProfileController::class, 'updatePassword'])->name('app.profile.password-update')->middleware([HandlePrecognitiveRequests::class]);

Route::get('/profile/edit', [ProfileController::class, 'edit'])->name('app.profile.edit')->middleware([HandlePrecognitiveRequests::class]);
Route::put('/profile/edit', [ProfileController::class, 'update'])->name('app.profile.update')->middleware([HandlePrecognitiveRequests::class]);
Route::post('profile/verification-notification', [ProfileController::class, 'resendVerificationEmail'])->name('verification.send');
Route::impersonate();

Route::redirect('settings/system', '/app/settings/system/users')
    ->middleware(['admin'])
    ->name('app.setting.system');
Route::get('/settings/system/users', [UserController::class, 'index'])
    ->middleware(['admin'])
    ->name('app.setting.system.user.index');
Route::get('/settings/system/users/create', [UserController::class, 'create'])
    ->middleware(['admin'])
    ->name('app.setting.system.user.create');
Route::post('/settings/system/users', [UserController::class, 'store'])
    ->middleware(['admin', HandlePrecognitiveRequests::class])
    ->name('app.setting.system.user.store');
Route::get('/settings/system/users/{user}/edit', [UserController::class, 'edit'])
    ->middleware(['admin'])
    ->name('app.setting.system.user.edit');
Route::put('/settings/system/users/{user}/edit', [UserController::class, 'update'])
    ->middleware(['admin', HandlePrecognitiveRequests::class])
    ->name('app.setting.system.user.update');
Route::delete('/settings/system/users/{user}/delete', [UserController::class, 'destroy'])
    ->middleware(['admin'])
    ->name('app.setting.system.user.delete');

Route::post('/settings/system/users/{user}/verification-notification', [UserController::class, 'resendVerificationEmail'])->name('user.verfication.send')->middleware(['admin']);

Route::put('/settings/system/users/{user}/reset-password', [UserController::class, 'resetPassword'])
    ->middleware(['admin'])
    ->name('app.setting.system.user.reset-password');
