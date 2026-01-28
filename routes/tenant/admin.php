<?php

declare(strict_types=1);

use App\Http\Controllers\App\Setting\UserController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
Route::middleware([
    'admin',
])->group(function () {

    Route::redirect('settings/system', '/app/settings/system/users')
        ->name('app.setting.system');
    Route::get('/settings/system/users', [UserController::class, 'index'])
        ->name('app.setting.system.user.index');
    Route::get('/settings/system/users/create', [UserController::class, 'create'])
        ->name('app.setting.system.user.create');
    Route::post('/settings/system/users', [UserController::class, 'store'])
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.setting.system.user.store');
    Route::get('/settings/system/users/{user}/edit', [UserController::class, 'edit'])
        ->name('app.setting.system.user.edit');
    Route::put('/settings/system/users/{user}/edit', [UserController::class, 'update'])
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('app.setting.system.user.update');
    Route::delete('/settings/system/users/{user}/delete', [UserController::class, 'destroy'])
        ->name('app.setting.system.user.delete');

    Route::post('/settings/system/users/{user}/verification-notification',
        [UserController::class, 'resendVerificationEmail'])->name('user.verification.send');

    Route::post('/settings/system/users/{user}/clear-pending-mail-address',
        [UserController::class, 'clearPendingMailAddress'])->name('user.clear-pending-mail-address');


        Route::put('/settings/system/users/{user}/reset-password', [UserController::class, 'resetPassword'])
        ->name('app.setting.system.user.reset-password');

});
