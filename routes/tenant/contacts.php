<?php

declare(strict_types=1);

use App\Http\Controllers\App\Contact\ContactAddressCreateController;
use App\Http\Controllers\App\Contact\ContactAddressStoreController;
use App\Http\Controllers\App\Contact\ContactAddressUpdateController;
use App\Http\Controllers\App\Contact\ContactCreateController;
use App\Http\Controllers\App\Contact\ContactDetailsController;
use App\Http\Controllers\App\Contact\ContactDetailsPersonsController;
use App\Http\Controllers\App\Contact\ContactEditAddressController;
use App\Http\Controllers\App\Contact\ContactEditController;
use App\Http\Controllers\App\Contact\ContactIndexController;
use App\Http\Controllers\App\Contact\ContactStoreController;
use App\Http\Controllers\App\Contact\ContactToggleFavoriteController;
use App\Http\Controllers\App\Contact\ContactUpdateController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

// Contacts
Route::get('contacts', ContactIndexController::class)->name('app.contact.index');

Route::get('contacts/create', ContactCreateController::class)->name('app.contact.create');

Route::post('contacts/store', ContactStoreController::class)
    ->name('app.contact.store')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('contacts/{contact}', ContactDetailsController::class)->name('app.contact.details');

Route::get('contacts/{contact}/edit', ContactEditController::class)->name('app.contact.edit');

Route::put('contacts/{contact}/edit', ContactUpdateController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.update');

Route::get('contacts/{contact}/persons', ContactDetailsPersonsController::class)
    ->name('app.contact.details.persons');

Route::get('contacts/{contact}/{address}/edit', ContactEditAddressController::class)
    ->name('app.contact.edit.address');

Route::get('contacts/{contact}/create', ContactAddressCreateController::class)
    ->name('app.contact.create.address');

Route::put('contacts/{contact}/toggle-favorite', ContactToggleFavoriteController::class)
    ->name('app.contact.toggle-favorite');

Route::put('contacts/{contact}/{contact_address}', ContactAddressUpdateController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.address.update');

Route::post('contacts/{contact}/address', ContactAddressStoreController::class)
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.contact.address.store');
