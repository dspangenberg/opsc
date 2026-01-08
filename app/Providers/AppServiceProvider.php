<?php

namespace App\Providers;

use App\Services\WeasyPdfService;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use Stancl\Tenancy\Events\TenancyInitialized;
use Stancl\Tenancy\Events\TenantSwitched;

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

        // Tenant-aware settings cache - listen to tenancy events
        Event::listen([TenancyInitialized::class, TenantSwitched::class], function ($event) {
            $tenantKey = $event->tenancy->tenant->getTenantKey();

            // Update cache prefix for this tenant
            config(['settings.cache.prefix' => "settings_{$tenantKey}_"]);

            // Clear settings cache for this tenant to avoid cross-tenant leaks
            Cache::forget("settings_{$tenantKey}");
            Cache::forget('laravel_settings');
        });
    }
}
