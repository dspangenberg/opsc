<?php

declare(strict_types=1);
use App\Http\Controllers\App\OfferController;
use App\Http\Controllers\App\OfferSectionController;
use App\Http\Controllers\App\TextModuleController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Invoices
Route::get('invoicing/offers/create', [OfferController::class, 'create'])
    ->name('app.offer.create');

Route::get('invoicing/offers', [OfferController::class, 'index'])
    ->name('app.offer.index');

Route::post('invoicing/offers', [OfferController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.offer.store');

Route::get('invoicing/offers/{offer}', [OfferController::class, 'show'])
    ->name('app.offer.details');

Route::get('invoicing/offers/{offer}/history', [OfferController::class, 'history'])
    ->name('app.offer.history');

Route::get('invoicing/offers/{offer}/history', [OfferController::class, 'history'])
    ->name('app.offer.history');

Route::get('invoicing/offers/{offer}/terms', [OfferController::class, 'terms'])
    ->name('app.offer.terms');

Route::put('invoicing/offers/lines-update/{offer}', [OfferController::class, 'updateLines'])
    ->name('app.offer.lines-update')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/offers/{offer}/pdf', [OfferController::class, 'downloadPdf'])
    ->name('app.offer.pdf');

Route::get('invoicing/offer-sections', [OfferSectionController::class, 'index'])->name('app.offer.section.index');
Route::get('invoicing/offer-sections/create', [OfferSectionController::class, 'create'])->name('app.offer.section.create');
Route::post('invoicing/offer-sections/store', [OfferSectionController::class, 'store'])->name('app.offer.section.store')->middleware([HandlePrecognitiveRequests::class]);
Route::get('invoicing/offer-sections/{section}', [OfferSectionController::class, 'edit'])->name('app.offer.section.edit');
Route::put('invoicing/offer-sections/{section}', [OfferSectionController::class, 'update'])->name('app.offer.section.update')->middleware([HandlePrecognitiveRequests::class]);
Route::delete('invoicing/offer-sections/{section}', [OfferSectionController::class, 'delete'])->name('app.offer.section.delete');
