<?php

declare(strict_types=1);

use App\Http\Controllers\App\InvoiceController;
use App\Http\Controllers\App\OfferController;
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
