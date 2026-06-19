<?php

namespace App\Models;

use Illuminate\Support\Facades\URL;
use ProtoneMedia\LaravelVerifyNewEmail\PendingUserEmail as BasePendingUserEmail;

/**
 * @property-read \Illuminate\Database\Eloquent\Model|\Eloquent $user
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PendingUserEmail forUser(\Illuminate\Database\Eloquent\Model $user)
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PendingUserEmail newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PendingUserEmail newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder<static>|PendingUserEmail query()
 * @mixin \Eloquent
 */
class PendingUserEmail extends BasePendingUserEmail
{
    public function verificationUrl(): string
    {
        $rootUrl = $this->tenantRootUrl();

        if ($rootUrl) {
            URL::forceRootUrl($rootUrl);
        }

        $url = URL::temporarySignedRoute(
            config('verify-new-email.route') ?: 'pendingEmail.verify',
            now()->addMinutes(config('auth.verification.expire', 60)),
            ['token' => $this->token]
        );

        if ($rootUrl) {
            URL::forceRootUrl(null);
        }

        return $url;
    }

    private function tenantRootUrl(): ?string
    {
        if (! function_exists('tenant') || ! tenant()) {
            return null;
        }

        $domain = tenant()->domain
            ?? tenant()->fallback_domain->domain
            ?? tenant()->domains->first()?->domain;

        if (! $domain) {
            return null;
        }

        if (! str_contains($domain, '.')) {
            $baseDomain = config('tenancy.identification.central_domains.0');
            if ($baseDomain) {
                $domain = $domain.'.'.$baseDomain;
            }
        }

        $scheme = str(config('app.url'))->before('://')->toString() ?: 'https';

        return $scheme.'://'.$domain;
    }
}
