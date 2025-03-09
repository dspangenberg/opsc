<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

declare(strict_types=1);

use App\Data\AccommodationData;
use App\Http\Controllers\App\Accommodation\AccommodationDetailsController;
use App\Http\Controllers\App\Accommodation\AccommodationIndexController;
use App\Http\Controllers\App\Accommodation\AccommodationStoreController;
use App\Http\Controllers\App\Calendar\CalendarCreateController;
use App\Http\Controllers\App\Calendar\CalendarEditController;
use App\Http\Controllers\App\Calendar\CalendarIndexController;
use App\Http\Controllers\App\Calendar\CalendarStoreController;
use App\Http\Controllers\App\Contact\ContactIndexController;
use App\Http\Controllers\App\Setting\Booking\Policy\BookingPolicyCreateController;
use App\Http\Controllers\App\Setting\Booking\Policy\BookingPolicyEditController;
use App\Http\Controllers\App\Setting\Booking\Policy\BookingPolicyIndexController;
use App\Http\Controllers\App\Setting\Booking\Season\SeasonCreateController;
use App\Http\Controllers\App\Setting\Booking\Season\SeasonEditController;
use App\Http\Controllers\App\Setting\Booking\Season\SeasonIndexController;
use App\Http\Controllers\App\Setting\Booking\Season\SeasonStoreController;
use App\Http\Controllers\App\Setting\Booking\Season\SeasonUpdateController;
use App\Http\Controllers\App\Setting\Email\Inbox\InboxCreateController;
use App\Http\Controllers\App\Setting\Email\Inbox\InboxEditController;
use App\Http\Controllers\App\Setting\Email\Inbox\InboxIndexController;
use App\Http\Controllers\App\Setting\Email\Inbox\InboxStoreController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Requests\AccommodationAddressStoreRequest;
use App\Http\Requests\AccommodationBaseStoreRequest;
use App\Http\Requests\AccommodationContactStoreRequest;
use App\Models\Accommodation;
use App\Models\AccommodationType;
use App\Models\Country;
use App\Models\Region;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laragear\WebAuthn\Http\Routes as WebAuthnRoutes;


/*
|--------------------------------------------------------------------------
| Tenant Routes
|--------------------------------------------------------------------------
|
| Here you can register the tenant routes for your application.
| These routes are loaded by the TenantRouteServiceProvider.
|
| Feel free to customize them however you want. Good luck!
|
*/

Route::get('/', function () {
    return redirect(route('app.dashboard'));
});

Route::middleware([
    'web',
    'auth'
])->prefix('app')->group(function () {

    Route::get('/', function () {
        return Inertia::render('App/Dashboard');
    })->name('app.dashboard');

    Route::get('accommodations', function () {
        return Inertia::render('App/Accommodation/AccommodationCreate', [
            'regions' => Region::all(),
            'countries' => Country::all(),
            'accommodation_types' => AccommodationType::all(),
            'accommodation' => AccommodationData::from(new Accommodation())
        ]);
    })->name('app.accommodation.create');


    Route::post('/app/accommodations/address/store', function (AccommodationAddressStoreRequest $request) {
    })->middleware([HandlePrecognitiveRequests::class])->name('app.accommodation.address.store');

    Route::get('calendars/create',
        CalendarCreateController::class)->name('app.calendar.create');

    Route::post('calendars',
        CalendarStoreController::class)->name('app.calendar.store');

    Route::get('calendars/{calendar}',
        CalendarIndexController::class)->name('app.calendar');

    Route::get('calendars/{calendar}/edit',
        CalendarEditController::class)->name('app.calendar');

    Route::get('app/accommodations',
        AccommodationIndexController::class)->name('app.accommodation.index');

    Route::get('contacts',
        ContactIndexController::class)->name('app.contact.index');


    Route::get('app/accommodations/{accommodation}',
        AccommodationDetailsController::class)->name('app.accommodation.details');

    Route::post('/app/accommodations/base/store', function (AccommodationBaseStoreRequest $request) {
    })->middleware([HandlePrecognitiveRequests::class])->name('app.accommodation.base.store');

    Route::post('/app/accommodations/address/store', function (AccommodationAddressStoreRequest $request) {
    })->middleware([HandlePrecognitiveRequests::class])->name('app.accommodation.address.store');

    Route::post('/app/accommodations/contact/store', function (AccommodationContactStoreRequest $request) {
    })->middleware([HandlePrecognitiveRequests::class])->name('app.accommodation.contact.store');


    Route::post('app/accommodations/store',
        AccommodationStoreController::class)->name('app.accommodation.store')->middleware([HandlePrecognitiveRequests::class]);


    Route::get('/soon', function () {
        return Inertia::render('Soon');
    })->name('app.soon');

    Route::get('/settings/email/smtp', function () {
        return Inertia::render('App/Settings/Email/Smtp/SmtpIndex');
    })->name('app.settings.email.smtp');

    Route::get('/settings/email/inboxes', function () {
        return Inertia::render('App/Settings/Email/Inbox/InboxIndex');
    })->name('app.settings.email.inboxes');

    Route::get('/settings/email/inboxes',
        InboxIndexController::class)->name('app.settings.email.inboxes');

    Route::get('/settings/email/inboxes/create',
        InboxCreateController::class)->name('app.settings.email.inboxes.create');

    Route::get('/settings/email/inboxes/edit/{inbox}',
        InboxEditController::class)->name('app.settings.email.inboxes.edit');

    Route::post('/settings/email/inboxes',
        InboxStoreController::class)->name('app.settings.email.inboxes.store')->middleware([HandlePrecognitiveRequests::class]);
    Route::put('/settings/email/inboxes/{inbox}',
        InboxStoreController::class)->name('app.settings.email.inboxes.update')->middleware([HandlePrecognitiveRequests::class]);


    Route::get('/settings/booking/seasons', SeasonIndexController::class)->name('app.settings.booking.seasons');
    Route::get('/settings/booking/seasons/{season}/edit',
        SeasonEditController::class)->name('app.settings.booking.seasons.edit');
    Route::get('/settings/booking/seasons/create',
        SeasonCreateController::class)->name('app.settings.booking.seasons.create');

    Route::put('/settings/booking/seasons/{season}',
        SeasonUpdateController::class)->name('app.settings.booking.seasons.update')->middleware([HandlePrecognitiveRequests::class]);
    Route::post('/settings/booking/seasons',
        SeasonStoreController::class)->name('app.settings.booking.seasons.store')->middleware([HandlePrecognitiveRequests::class]);


    Route::get('/settings/booking/policies',
        BookingPolicyIndexController::class)->name('app.settings.booking.policies');
    Route::get('/settings/booking/policies/{$bookingPolicy}',
        BookingPolicyEditController::class)->name('app.settings.booking.policies.edit');
    Route::get('/settings/booking/policies/create',
        BookingPolicyCreateController::class)->name('app.settings.booking.policies.create');


    Route::get('/settings/booking/cancellation',
        BookingPolicyIndexController::class)->name('app.settings.booking.cancellation');


    Route::get('/settings/booking/group-of-people', function () {
        return Inertia::render('App/Settings/Booking/GroupOfPeople/GroupOfPeopleIndex');
    })->name('app.settings.booking.group-of-people');

    Route::get('/settings/policies/booking', function () {
        return Inertia::render('App/Settings/Policies/Booking/BookingIndex');
    })->name('app.settings.policies.booking');

    Route::get('/settings/policies/cancellation', function () {
        return Inertia::render('App/Settings/Policies/Cancellation/CancellationIndex');
    })->name('app.settings.policies.cancellation');

    Route::get('/onboarding', function () {
        return Inertia::modal('Onboarding')->baseRoute('app.soon');
    })->name('app.onboarding');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('app.logout');
});

Route::middleware([
    'web',
])->prefix('auth')->group(function () {

    WebAuthnRoutes::register()->withoutMiddleware(VerifyCsrfToken::class);

    Route::get('login', [
        AuthenticatedSessionController::class, 'create'
    ])->name('login');
    Route::post('login', [
        AuthenticatedSessionController::class, 'store'
    ])->middleware([HandlePrecognitiveRequests::class])->name('login.store');
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});
