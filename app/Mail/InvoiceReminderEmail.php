<?php

namespace App\Mail;

use App\Models\InvoiceReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class InvoiceReminderEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public InvoiceReminder $reminder)
    {
    }

    public function attachments(): array
    {
        return [$this->reminder];
    }

    public function envelope(): Envelope
    {
        return new Envelope(subject: $this->reminder->email_subject);
    }

    public function content(): Content
    {
        return new Content(
            view: 'generated.reminder',
            with: [
                'city' => $this->reminder->city,
                'name' => $this->reminder->name,
                'type' => $this->reminder->type,
                'invoice_number' => $this->reminder->invoice->formated_invoice_number,
                'invoice_date' => $this->reminder->invoice->issued_on->format('d.m.Y'),
            ]
        );
    }
}
