<?php

namespace App\Mail;

use App\Models\Invoice;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class RecurringInvoiceEmail extends Mailable
{
    use Queueable, SerializesModels;

    public Invoice $invoice;

    public function __construct(Invoice $invoice)
    {
        $this->invoice = $invoice;
    }

    public function build()
    {
        $invoice = $this->invoice;

        return $this->subject('opsc.cloud - Neue wiederkehrende Rechnung wurde erstellt')
            ->view('generated.recurring-invoice', [
                'invoice' => $invoice
            ]);
    }
}
