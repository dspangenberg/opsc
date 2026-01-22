<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Verified;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class InitialPasswordController extends Controller
{
    /**
     * Mark the authenticated user's email address as verified.
     */
    public function __invoke(Request $request): Response
    {
        if (! $request->hasValidSignature()) {
            abort(500, 'Der Bestätigungslink ist leider ungültig oder bereits abgelaufen.');
        }

        $routeId = (string) $request->route('id');
        $user = User::findOrFail($routeId);

        return Inertia::render('Auth/InitialPassword', ['user' => $user]);
    }
}
