<?php

declare(strict_types=1);

use App\Http\Controllers\App\ContactController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Contacts
Route::get('contacts', [ContactController::class, 'index'])->name('app.contact.index');

Route::get('contacts/create', [ContactController::class, 'create'])->name('app.contact.create');

Route::post('contacts/store', [ContactController::class, 'store'])
    ->name('app.contact.store')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('contacts/{contact}', [ContactController::class, 'show'])->name('app.contact.details');

Route::get('contacts/{contact}/edit', [ContactController::class, 'edit'])->name('app.contact.edit');

Route::put('contacts/{contact}/edit', [ContactController::class, 'update'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.update');

Route::get('contacts/{contact}/persons', [ContactController::class, 'persons'])
    ->name('app.contact.details.persons');

Route::get('contacts/{contact}/{address}/edit', [ContactController::class, 'editAddress'])
    ->name('app.contact.edit.address');

Route::get('contacts/{contact}/create', [ContactController::class, 'createAddress'])
    ->name('app.contact.create.address');

Route::put('contacts/{contact}/toggle-favorite', [ContactController::class, 'toggleFavorite'])
    ->name('app.contact.toggle-favorite');

Route::put('contacts/{contact}/{contact_address}', [ContactController::class, 'updateAddress'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.address.update');

Route::post('contacts/{contact}/address', [ContactController::class, 'storeAddress'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.address.store');

Route::post('contacts/{contact}/note-store', [ContactController::class, 'storeNote'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.note-store');
