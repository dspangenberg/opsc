<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Mail;

use App\Models\TempData;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerifyEmailAddressForCloudRegistrationMail extends Mailable
{
    use Queueable, SerializesModels;

    protected static TempData $tenant;

    protected static string $verificationUrl;

    /**
     * Create a new message instance.
     */
    public function __construct(TempData $tenant, string $verificationUrl)
    {
        self::$tenant = $tenant;
        self::$verificationUrl = $verificationUrl;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'ecting.cloud - Bitte bestätige Deine E-Mail-Adresse',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $tenant = VerifyEmailAddressForCloudRegistrationMail::$tenant['data'];

        return new Content(

            view: 'generated.emails.verify-email',
            with: [
                'title' => 'ecting.cloud - E-Mail-Adresse bestätigen',
                'name' => $tenant['first_name'], // .' '.$tenant['last_name'],
                'verificationUrl' => VerifyEmailAddressForCloudRegistrationMail::$verificationUrl,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
