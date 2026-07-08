<?php

declare(strict_types=1);

use App\Http\Controllers\Admin\DropboxController;
use App\Http\Controllers\Admin\EmailAccountController;
use App\Http\Controllers\Admin\SettingController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\App\InboxController;
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

    Route::redirect('admin/emails', '/admin/emails/dropboxes')->name('admim.emails.index');

    Route::get('emails/inbox/{mail?}', [InboxController::class, 'index'])->name('admim.inbox.index');
    Route::delete('emails/inbox/{mail}', [InboxController::class, 'destroy'])->name('admim.inbox.destroy');
    Route::put('emails/inbox/{mail}', [InboxController::class, 'import'])->name('admim.inbox.import');

    Route::get('emails/dropboxes', [DropboxController::class, 'index'])->name('admin.dropbox.index');
    Route::get('emails/dropboxes/create', [DropboxController::class, 'create'])->name('admin.dropbox.create');
    Route::get('emails/dropboxes/create', [DropboxController::class, 'create'])->name('admin.dropbox.create');
    Route::post('emails/dropboxes/store', [DropboxController::class, 'store'])->name('admin.dropbox.store')->middleware([HandlePrecognitiveRequests::class]);
    Route::get('emails/dropboxes/{dropbox}/edit', [DropboxController::class, 'edit'])->name('admin.dropbox.edit');
    Route::put('emails/dropboxes/{dropbox}/update', [DropboxController::class, 'update'])->name('admin.dropbox.update')->middleware([HandlePrecognitiveRequests::class]);
    Route::delete('emails/dropboxes/{dropbox}', [DropboxController::class, 'destroy'])->name('admin.dropbox.delete');

    Route::get('emails/smtp-accounts', [EmailAccountController::class, 'index'])->name('admin.email-account.index');
    Route::get('emails/smtp-accounts/create', [EmailAccountController::class, 'create'])->name('admin.email-account.create');
    Route::get('emails/smtp-accounts/{emailAccount}/edit', [EmailAccountController::class, 'edit'])->name('admin.email-account.edit');
    Route::put('emails/smtp-accounts/{emailAccount}/edit', [EmailAccountController::class, 'update'])->name('admin.email-account.update')->middleware([HandlePrecognitiveRequests::class]);
    Route::post('emails/smtp-accounts', [EmailAccountController::class, 'store'])->name('admin.email-account.store')->middleware([HandlePrecognitiveRequests::class]);
    Route::put('emails/smtp-accounts/{emailAccount}/send-test-mail', [EmailAccountController::class, 'sendTestMail'])->name('admin.email-account.send-test-mail');
    Route::put('emails/smtp-accounts/{emailAccount}/set-default', [EmailAccountController::class, 'setDefault'])->name('admin.email-account.set-default');
});
