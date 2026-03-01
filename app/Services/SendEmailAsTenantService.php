<?php

namespace App\Services;

use App\Mail\TenantEmail;
use App\Models\Contact;
use App\Models\EmailAccount;
use App\Models\EmailTemplate;
use App\Models\Tenant;
use App\Settings\MailSettings;
use Illuminate\Mail\Mailer;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class SendEmailAsTenantService
{
    public Mailer  $mailer;
    public string $signature;
    public MailSettings $settings;
    public string $subject;
    public string $body;
    public Tenant $tenant;

    public function __construct(public EmailTemplate $template, public EmailAccount $emailAccount, public array $data = [])
    {
        $this->tenant = tenant();
        $this->settings = app(MailSettings::class);

        if (!$this->settings->smtp_host || !$this->settings->smtp_port || !$this->settings->smtp_encryption) {
            Log::error("Es wurde kein SMTP-Server für Tenant  $this->tenant->id definiert.");
            return false;
        }

        if (!$emailAccount->smtp_username || !$emailAccount->smtp_password) {
            Log::error("Es wurde kein Mailkonto für Tenant  $this->tenant->id gefunden.");
            return false;
        }

        $this->mailer = Mail::build([
            'transport' => 'smtp',
            'host' => $this->settings->smtp_host,
            'port' => $this->settings->smtp_port,
            'encryption' => $this->settings->smtp_encryption ?? 'null',
            'username' => $emailAccount->smtp_username,
            'password' => $emailAccount->smtp_password,
            'from' => [
                'address' => $emailAccount->email,
                'name' => $emailAccount->name,
            ]
        ]);

        $this->mailer->alwaysFrom($emailAccount->email, $emailAccount->name);

        $this->signature = Blade::render($this->settings->signature, ['email_account' => $this->emailAccount, 'city'=>$this->data->city ?? ''], true);
        $this->subject = Blade::render($this->template->subject, $this->data, true);

        return $this;
    }

    public function sendMailToContact(Contact $contact) {
    }

    public function sendEmail(string $email, string $name, string $city, array $data) {

        $this->data = [
            'name' => $name,
            'city' => $city,
            ...$data
        ];

        try {
            $this->body = Blade::render($this->template->body, $this->data, true);
            return $this->mailer->to($email ?: $this->settings->cc)->cc($this->settings->cc)->send(new TenantEmail(
                $this->subject, $this->body, $this->signature
            ));
        } catch (\Exception $e) {
            Log::error("Fehler beim Versenden der E-Mail: " . $e->getMessage());
            return false;
        }
    }
}
