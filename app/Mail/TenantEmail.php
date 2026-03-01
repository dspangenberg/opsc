<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TenantEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(string $subject, public string $body, public string $signature)
    {
        $this->subject = $subject;
    }



    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'generated.tenant',
            with: [
                'signature' => $this->signature,
                'content' => $this->body
            ]
        );
    }
}
