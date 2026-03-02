<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Attachment;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class TenantEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * `@param` array{path:string,name:string}|array{} $attachment
     */
    public function __construct(
        public $subject,
        public string $body,
        public string $signature,
        public string $imprint,
        public string $logoUrl,
        public string $logoStyleHeight,
        public string $logoStyleWidth,
        public string $logoStyleRadius,
        public array $attachment = []
    ) {
    }

    public function attachments(): array
    {
        if (!isset($this->attachment['path'], $this->attachment['name'])) {
            return [];
        }

        return [
            Attachment::fromPath($this->attachment['path'])
                ->as($this->attachment['name']),
        ];
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
                'imprint' => $this->imprint,
                'content' => $this->body,
                'logo_url' => $this->logoUrl,
                'logo_height' => $this->logoStyleHeight,
                'logo_width' => $this->logoStyleWidth,
                'logo_radius' => $this->logoStyleRadius,
            ]
        );
    }
}
