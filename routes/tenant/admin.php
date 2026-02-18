<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Stancl\Tenancy\Middleware;

Route::middleware([
    'web',
    'auth',
    'admin',
    Middleware\InitializeTenancyByDomainOrSubdomain::class,
    Middleware\PreventAccessFromUnwantedDomains::class,
    Middleware\ScopeSessions::class,
])->prefix('admin')->group(function () {

    Route::redirect('/', '/admin/users')
        ->name('admin');
    Route::get('/users', [UserController::class, 'index'])
        ->name('admin.user.index');
    Route::get('users/create', [UserController::class, 'create'])
        ->name('admin.user.create');
    Route::post('/users', [UserController::class, 'store'])
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('admin.user.store');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])
        ->name('admin.user.edit');
    Route::put('/users/{user}/edit', [UserController::class, 'update'])
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('admin.user.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])
        ->name('admin.user.delete');

    Route::post('users/{user}/verification-notification',
        [UserController::class, 'resendVerificationEmail'])->name('admin.user.verification.send');

    Route::post('users/{user}/clear-pending-mail-address',
        [UserController::class, 'clearPendingMailAddress'])->name('admin.user.clear-pending-mail-address');

    Route::put('users/{user}/reset-password', [UserController::class, 'resetPassword'])
        ->name('admin.user.reset-password');

    Route::get('settings', [SettingController::class, 'index'])->name('admin.setting.index');
    Route::put('settings', [SettingController::class, 'update'])->name('admin.setting.update');

});
