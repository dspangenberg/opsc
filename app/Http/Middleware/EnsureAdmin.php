<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

class EnsureAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->is_admin) {
            Inertia::flash('toast', ['type' => 'error', 'message' => 'Du hast keine Berechhtigung diese URL aufzurufen'])->back();
            return Redirect::route('app.dashboard');
        }

        return $next($request);
    }
}
