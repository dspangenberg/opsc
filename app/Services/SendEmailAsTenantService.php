<?php

namespace App\Services;

use App\Mail\TenantEmail;
use App\Models\Contact;
use App\Models\EmailAccount;
use App\Models\EmailTemplate;
use App\Models\Tenant;
use App\Settings\GeneralSettings;
use App\Settings\MailSettings;
use Exception;
use Illuminate\Mail\Mailer;
use Illuminate\Mail\SentMessage;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use RuntimeException;

class SendEmailAsTenantService
{
    public Mailer $mailer;
    public string $signature;
    public MailSettings $settings;
    public string $subject;
    public string $body;
    public string $imprint;
    public Tenant $tenant;

    public array $attachment = [];

    public function __construct(
        public EmailTemplate $template,
        public EmailAccount | null $emailAccount,
        public array $data = []
    ) {
        $this->tenant = tenant();
        $this->settings = app(MailSettings::class);

        if ($emailAccount === null) {
            $emailAccount = EmailAccount::where('is_default', true)->first();
        }

        $isLocal = config('app.env') === 'local';

        if ($isLocal) {
            $this->settings->smtp_host = '127.0.0.1';
            $this->settings->smtp_port = 2525;
            $this->settings->smtp_encryption = null;
        }

        if (!$this->settings->smtp_host || !$this->settings->smtp_port) {
            Log::error("Es wurde kein SMTP-Server für Tenant  $this->tenant->id definiert.");
            throw new RuntimeException("Es wurde kein SMTP-Server für Tenant {$this->tenant->id} definiert.");

        }

        if (!$emailAccount->smtp_username || !$emailAccount->smtp_password) {
            Log::error("Es wurde kein Mailkonto für Tenant  $this->tenant->id gefunden.");
            throw new RuntimeException("Es wurde kein Mailkonto für Tenant {$this->tenant->id} gefunden.");

        }

        $this->mailer = Mail::build([
            'transport' => 'smtp',
            'host' => $this->settings->smtp_host,
            'port' => $this->settings->smtp_port,
            'encryption' => $this->settings->smtp_encryption ?? null,
            'username' => $emailAccount->smtp_username,
            'password' => $isLocal ? '' : $emailAccount->smtp_password,
            'from' => [
                'address' => $emailAccount->email,
                'name' => $emailAccount->name,
            ]
        ]);

        $this->mailer->alwaysFrom($emailAccount->email, $emailAccount->name);
    }

    public function sendMailToContact(Contact $contact): bool
    {
        return false;
    }

    public function setAttachment(string $path, string $name): self
    {
        $this->attachment = [
            'path' => $path,
            'name' => $name,
        ];
        return $this;
    }
    public function setBody(string $body): self
    {
        $this->template->body = $body;
        return $this;
    }

    public function setSubject(string $subject): self
    {
        $this->template->subject = $subject;
        return $this;
    }

    private function parseLogoClasses(string $logoClass): array
    {
        $result = [
            'height' => '3rem',
            'width' => 'auto',
            'radius' => '0.375rem'
        ];

        $classMap = [
            'h-8' => ['height' => '2rem'],
            'h-10' => ['height' => '2.5rem'],
            'h-12' => ['height' => '3rem'],
            'w-auto' => ['width' => 'auto'],
            'w-full' => ['width' => '100%'],
            'rounded-md' => ['radius' => '0.375rem'],
            'rounded-lg' => ['radius' => '0.5rem'],
        ];

        $classes = explode(' ', trim($logoClass));
        foreach ($classes as $class) {
            if (isset($classMap[$class])) {
                foreach ($classMap[$class] as $property => $value) {
                    $result[$property] = $value;
                }
            }
        }

        return $result;
    }

    public function sendEmail(string $email, string $name, string $city, array $data): SentMessage | bool
    {

        $this->data = [
            'name' => $name,
            'city' => $city,
            ...$data
        ];

        $logoStyles = $this->parseLogoClasses(app(GeneralSettings::class)->logo_class);

        try {
            $this->body = Blade::render($this->template->body, $this->data, true);
            $this->subject = Blade::render($this->template->subject, $this->data, true);
            $this->imprint = Blade::render($this->settings->imprint, ['imprint' => $this->settings->imprint], true);
            $this->signature = Blade::render($this->settings->signature, ['email_account' => $this->emailAccount, 'city' => $this->data['city'] ?? ''], true);
            return $this->mailer->to($email ?: $this->settings->cc)->cc($this->settings->cc)->send(new TenantEmail(
                $this->subject,
                $this->body,
                $this->signature,
                $this->imprint,
                app(GeneralSettings::class)->logo_url,
                $logoStyles['height'],
                $logoStyles['width'],
                $logoStyles['radius'],
                $this->attachment
            ));
        } catch (Exception $e) {
            Log::error("Fehler beim Versenden der E-Mail: ".$e->getMessage());
            return false;
        }
    }
}
