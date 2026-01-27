<?php

namespace App\Providers;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        Auth::macro('impersonator', function (): ?User {
            $impersonator = app('impersonate')->getImpersonator();

            return $impersonator instanceof User ? $impersonator : null;
        });

        Auth::macro('impersonatorId', function (): ?int {
            return app('impersonate')->getImpersonatorId();
        });
    }
}
