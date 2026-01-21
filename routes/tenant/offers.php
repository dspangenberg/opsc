<?php

declare(strict_types=1);

use App\Http\Controllers\App\OfferController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('invoicing/offers/create', [OfferController::class, 'create'])
    ->name('app.offer.create');

Route::get('invoicing/offers', [OfferController::class, 'index'])
    ->name('app.offer.index');

Route::post('invoicing/offers', [OfferController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.offer.store');

Route::get('invoicing/offers/{offer}/edit', [OfferController::class, 'edit'])
    ->name('app.offer.edit');

Route::get('invoicing/offers/{offer}', [OfferController::class, 'show'])
    ->name('app.offer.details');

Route::put('invoicing/offers/{offer}', [OfferController::class, 'update'])
    ->name('app.offer.update')->middleware([HandlePrecognitiveRequests::class]);


Route::get('invoicing/offers/{offer}/history', [OfferController::class, 'history'])
    ->name('app.offer.history');

Route::get('invoicing/offers/{offer}/terms', [OfferController::class, 'terms'])
    ->name('app.offer.terms');

Route::put('invoicing/offers/{offer}/release', [OfferController::class, 'release'])
    ->name('app.offer.release');

Route::put('invoicing/offers/{offer}/unrelease', [OfferController::class, 'unrelease'])
    ->name('app.offer.unrelease');


Route::put('invoicing/offers/{offer}/sort-attachments/', [OfferController::class, 'sortAttachments'])
    ->name('app.offer.sort-attachments');

Route::delete('invoicing/offers/{offer}/delete-attachment/{attachment}', [OfferController::class, 'removeAttachment'])->name('app.offer.remove-attachment');

Route::put('invoicing/offers/{offer}/add-attachments/', [OfferController::class, 'addAttachments'])
    ->name('app.offer.add-attachments');

Route::put('invoicing/offers/lines-update/{offer}', [OfferController::class, 'updateLines'])
    ->name('app.offer.lines-update')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('invoicing/offers/{offer}/pdf', [OfferController::class, 'downloadPdf'])
    ->name('app.offer.pdf');

Route::get('invoicing/offers/{offer}/duplicate', [OfferController::class, 'duplicate'])
    ->name('app.offer.duplicate');

Route::delete('invoicing/offers/{offer}/delete', [OfferController::class, 'destroy'])
    ->name('app.offer.destroy');

Route::put('invoicing/offers/{offer}/mark-as-sent', [OfferController::class, 'markAsSent'])
    ->name('app.offer.mark-as-sent');

Route::post('invoicing/offers/{offer}/invoice', [OfferController::class, 'createInvoice'])
    ->name('app.offer.create-invoice');


Route::put('invoicing/offers/terms/{offer}', [OfferController::class, 'updateTerms'])
    ->name('app.offer.update-terms')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::put('invoicing/offers/{offer}/terms/section/{offerSection}', [OfferController::class, 'updateSection'])
    ->name('app.offer.update-section')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::post('invoicing/offers/{offer}/terms/store', [OfferController::class, 'addSectionsToOffer'])
    ->name('app.offer.add-sections');

Route::delete('invoicing/offers/{offer}/terms/section/{offerSection}', [OfferController::class, 'deleteSection'])->name('app.offer.delete-section');

Route::put('invoicing/offers/{offer}/terms/sort-sections', [OfferController::class, 'sortSections'])
    ->name('app.offer.sort-sections');


