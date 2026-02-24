<?php

namespace App\Mail;

use App\Models\Invoice;
use App\Models\InvoiceReminder;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InvoiceReminderEmail extends Mailable
{
    use Queueable, SerializesModels;

    public InvoiceReminder $reminder;

    public function __construct(InvoiceReminder $reminder)
    {
        $this->reminder = $reminder;
    }

    public function attachments(): array
    {
        return [$this->reminder];
    }

    public function build()
    {
        $reminder = $this->reminder;

        return $this->subject($reminder->email_subject)
            ->view('generated.reminder', [
                'city' => $reminder->city,
                'name' => $reminder->name,
                'type' => $reminder->type,
                'invoice_number' => $reminder->invoice->formated_invoice_number,
                'invoice_date' => $reminder->invoice->issued_on->format('d.m.Y')
            ]);
    }
}
