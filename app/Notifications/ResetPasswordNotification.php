<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword as BaseResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends BaseResetPassword
{
    public function toMail($notifiable): MailMessage
    {
        $name = $notifiable->first_name ?: ($notifiable->full_name ?? $notifiable->email);
        $resetUrl = $this->buildResetUrl($notifiable);

        return (new MailMessage)
            ->subject('opsc.cloud - Passwort zurücksetzen')
            ->view('generated.reset-password', [
                'name' => $name,
                'resetUrl' => $resetUrl,
            ]);
    }

    private function buildResetUrl($notifiable): string
    {
        $parameters = [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ];

        if (function_exists('tenant') && tenant()) {
            $domain = tenant()->domain
                ?? tenant()->fallback_domain->domain
                ?? tenant()->domains->first()?->domain;

            if ($domain && ! str_contains($domain, '.')) {
                $baseDomain = config('tenancy.identification.central_domains.0');
                if ($baseDomain) {
                    $domain = $domain.'.'.$baseDomain;
                }
            }

            if ($domain && function_exists('tenant_route')) {
                return tenant_route($domain, 'password.reset', $parameters);
            }
        }

        return url(route('password.reset', $parameters, false));
    }
}
