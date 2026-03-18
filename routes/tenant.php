<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

declare(strict_types=1);

use App\Enums\InboxEntryStatus;
use App\Http\Controllers\App\BookmarkController;
use App\Http\Controllers\App\InboxController;
use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\InitialPasswordController;
use App\Http\Controllers\Auth\InitialPasswordStoreController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Models\User;
use Carbon\Carbon;
use ProtoneMedia\LaravelVerifyNewEmail\Http\VerifyNewEmailController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Stancl\Tenancy\Features\UserImpersonation;
use Stancl\Tenancy\Middleware;
use App\Models\InboxEntry;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Foundation\Http\Middleware\ValidateCsrfToken;

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

require __DIR__.'/tenant/admin.php';

Route::middleware([
    'web',
    'auth',
    Middleware\InitializeTenancyByDomainOrSubdomain::class,
    Middleware\PreventAccessFromUnwantedDomains::class,
    Middleware\ScopeSessions::class,
])->prefix('app')->group(function () {
    Route::get('/', function () {
        return Inertia::render('App/Dashboard');
    })->name('app.dashboard');

    // Domain routes
    require __DIR__.'/tenant/bookkeeping.php';
    require __DIR__.'/tenant/contacts.php';
    require __DIR__.'/tenant/documents.php';
    require __DIR__.'/tenant/invoices.php';
    require __DIR__.'/tenant/offers.php';
    require __DIR__.'/tenant/projects.php';
    require __DIR__.'/tenant/settings.php';
    require __DIR__.'/tenant/times.php';

    Route::post('bookmarks/store', [BookmarkController::class, 'store'])->name('app.bookmark.store');
    Route::post('bookmarks/store-folder',
        [BookmarkController::class, 'storeFolder'])->name('app.bookmark.store-folder');
    Route::put('bookmarks/{bookmark}/toggle-pin',
        [BookmarkController::class, 'togglePin'])->name('app.bookmark.toggle-pin');
    Route::put('bookmarks/{bookmark}/rename', [BookmarkController::class, 'rename'])->name('app.bookmark.rename');
    Route::put('bookmarks/{bookmark}/restore',
        [BookmarkController::class, 'restore'])->withTrashed()->name('app.bookmark.restore');
    Route::delete('bookmarks/{bookmark}', [BookmarkController::class, 'trash'])->name('app.bookmark.trash');
    Route::put('bookmarks/folder/{bookmarkFolder}',
        [BookmarkController::class, 'renameFolder'])->name('app.bookmark.rename-folder');
    Route::delete('bookmarks/folder/{bookmarkFolder}',
        [BookmarkController::class, 'trashFolder'])->name('app.bookmark.trash-folder');
    Route::put('bookmarks/folder/{bookmarkFolder}/restore',
        [BookmarkController::class, 'restoreFolder'])->withTrashed()->name('app.bookmark.restore-folder');

    Route::get('inbox', [InboxController::class, 'index'])->name('app.inbox.index');


    Route::get('/onboarding', function () {
        return Inertia::modal('Onboarding')->baseRoute('app.soon');
    })->name('app.onboarding');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('app.logout');
});

Route::middleware([
    'web',
    Middleware\InitializeTenancyByDomainOrSubdomain::class,
    Middleware\PreventAccessFromUnwantedDomains::class,
    Middleware\ScopeSessions::class,
])->prefix('auth')->group(function () {

    Route::get('/impersonate/{token}', function ($token) {
        return UserImpersonation::makeResponse($token);
    })->name('tenant.impersonate');
    Route::get('login', [
        AuthenticatedSessionController::class, 'create',
    ])->name('login');
    Route::post('login', [
        AuthenticatedSessionController::class, 'store',
    ])->middleware([HandlePrecognitiveRequests::class])->name('login.store');
    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->middleware([HandlePrecognitiveRequests::class])
        ->name('password.email');

    Route::get('pendingEmail/verify/{token}', [VerifyNewEmailController::class, 'verify'])
        ->middleware(['signed'])
        ->name('pendingEmail.verify');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::get('confirm-email/{id}/{hash}', [VerifyEmailController::class, '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('email.verify');

    Route::get('/initial-password/{id}', [InitialPasswordController::class, '__invoke'])
        ->middleware(['signed', 'throttle:6,1'])
        ->name('initial-password');

    Route::post('/initial-password/store', [
        InitialPasswordStoreController::class, '__invoke'
    ])->name('initial-password.store')->middleware([HandlePrecognitiveRequests::class]);

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store')->middleware([HandlePrecognitiveRequests::class]);
});

Route::middleware([
    'web',
    Middleware\InitializeTenancyByDomainOrSubdomain::class,
    Middleware\PreventAccessFromUnwantedDomains::class,
    Middleware\ScopeSessions::class,
])->group(function () {
    Route::post('/postal', function (Request $request) {
        if (config('app.env') === 'production') {

        $signature = $request->header('X-Postal-Signature-256');
        if (!$signature) {
            return response(null, 401);
        }

        $publicKeyPem = config('services.postal.public_key');

        if (empty($publicKeyPem)) {
            Log::error('Postal: Public key not configured');
            return response(null, 500);
        }

        $publicKey = openssl_pkey_get_public($publicKeyPem);
        if ($publicKey === false) {
            Log::error('Postal: Invalid public key');
            return response(null, 500);
        }

        $rawBody = $request->getContent();
        $decoded = base64_decode($signature, true);
        if ($decoded === false) {
            return response(null, 401);
        }

        $verificationResult = openssl_verify($rawBody, $decoded, $publicKey, OPENSSL_ALGO_SHA256);

        if ($verificationResult !== 1) {
            if ($verificationResult === 0) {
                return response(null, 401);
            }

            Log::error('Postal: Signature verification error');
            return response(null, 500);
        }
    }

        $payload = $request->json()->all();
        if (!isset($payload['from'], $payload['to'])) {
            return response(null, 422);
        }

        $from = parseMailParty((string) $payload['from'])['email'];
        $to = parseMailParty((string) $payload['to'])['email'];

        $messageId = $payload['message_id'] ?? null;

        if (!isset($payload['date'])) {
            return response(null, 422);
        }

        try {
            $sentAt = Carbon::parse((string) $payload['date']);
        } catch (Throwable $exception) {
            return response(null, 422);
        }

        $attributes = [
            'payload' => $payload,
            'message_id' => $messageId,
            'from' => $from,
            'to' => $to,
            'subject' => $payload['subject'] ?? null,
            'user_id' => User::query()->where('email', $to)->value('id')
                ?? User::query()->where('email', $from)->value('id'),
            'received_at' => now(),
            'status' => InboxEntryStatus::PENDING,
            'sent_at' => $sentAt,
        ];

        if ($messageId !== null) {
            InboxEntry::updateOrCreate(['message_id' => $messageId], $attributes);
        } else {
            InboxEntry::create($attributes);
        }

        Log::info('Postal: Inbox entry created', [
            'message_id' => $payload['message_id'] ?? null,
        ]);

        return response(null, 200);
    })->withoutMiddleware([ValidateCsrfToken::class]);
});
