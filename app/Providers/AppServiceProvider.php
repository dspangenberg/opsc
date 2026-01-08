<?php

namespace App\Providers;

use App\Services\WeasyPdfService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Spatie\LaravelSettings\SettingsCache;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->bind(WeasyPdfService::class, WeasyPdfService::class);
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        if ($this->app->environment('local')) {
            Mail::alwaysTo('danny.spangenberg@twiceware.de');
        }
        Vite::prefetch(concurrency: 3);

        // Tenant-aware settings cache
        if (tenancy()->initialized) {
            app(SettingsCache::class)->setBaseCacheKey(
                'settings_'.tenant()->getTenantKey()
            );
        }
    }
}
