<?php

use App\Http\Controllers\Cloud\Register\StoreRegistrationCredentials;
use App\Http\Controllers\Cloud\Register\TemporaryStoreRegistrationController;
use App\Http\Controllers\Cloud\Register\VerifyMailAddressAndCredentialsController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

foreach (config('tenancy.identification.central_domains') as $domain) {
    Route::domain($domain)->prefix('cloud')->group(function () {

        Route::post('register',
            TemporaryStoreRegistrationController::class)->name('cloud.register.store')->middleware([HandlePrecognitiveRequests::class]);

        Route::get('register/verify',
            VerifyMailAddressAndCredentialsController::class)->name('cloud.register.verify');

        Route::post('register/credentials',
            StoreRegistrationCredentials::class)->name('cloud.register.credentials')->middleware([HandlePrecognitiveRequests::class]);

        Route::get('/', function () {
            return redirect(route('cloud.register'));
        });

        Route::get('/register', function () {
            return Inertia::render('Cloud/Register');
        })->name('cloud.register');
    });
}
