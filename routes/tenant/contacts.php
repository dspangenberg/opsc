<?php

declare(strict_types=1);

use App\Http\Controllers\App\ContactController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Contacts
Route::get('contacts', [ContactController::class, 'index'])->name('app.contact.index');

Route::get('contacts/create', [ContactController::class, 'create'])->name('app.contact.create');

Route::get('contacts/{company}/create-person', [ContactController::class, 'createPerson'])->name('app.contact.create-person');
Route::post('contacts/store-person', [ContactController::class, 'storePerson'])->name('app.contact.store-person')->middleware([HandlePrecognitiveRequests::class]);

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


Route::put('contacts/{contact}/toggle-favorite', [ContactController::class, 'toggleFavorite'])
    ->name('app.contact.toggle-favorite');

Route::post('contacts/{contact}/note-store', [ContactController::class, 'storeNote'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.note-store');

Route::put('contacts/{contact}/archive', [ContactController::class, 'archiveToggle'])->name('app.contact.archive');

Route::delete('contacts/{contact}', [ContactController::class, 'destroy'])->name('app.contact.delete');

Route::put('contacts/bulk-archive', [ContactController::class, 'bulkArchive'])->name('app.contact.bulk-archive');
