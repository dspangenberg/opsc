<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class VerifyEmailController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request): RedirectResponse
    {
        $routeId = (string) $request->route('id');
        $hash = (string) $request->route('hash');
        $authUser = $request->user();

        if (! $authUser && ! $request->hasValidSignature()) {
            abort(403);
        }
        $user = $authUser ?: User::findOrFail($routeId);

        if ($authUser && (string) $authUser->getKey() !== $routeId) {
            abort(403);
        }

        if (! hash_equals(sha1($user->getEmailForVerification()), $hash)) {
            abort(403, 'Der Verifizierungslink ist ungültig.');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
        }

        if ($user->markEmailAsVerified()) {
            event(new Verified($user));
        }

        return redirect()->intended(route('dashboard', absolute: false).'?verified=1');
    }
}
