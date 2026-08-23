<?php

namespace App\Services;

use App\Models\BookkeepingAccount;
use App\Models\BookkeepingBooking;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\NumberRange;

class BookeppingBookingService
{
    public function createBookingForInvoice(Invoice $invoice): ?BookkeepingBooking
    {

        if (! $invoice->sent_at) {
            $invoice->sent_at = now();
            $invoice->save();
        }

        $invoice->load('range_document_number');

        if (! $invoice->range_document_number || $invoice->range_document_number->number_range_id !== 1) {
            $invoice->number_range_document_numbers_id = NumberRange::createDocumentNumber($invoice,
                'issued_on');
            $invoice->save();
        }

        $booking = BookkeepingBooking::whereMorphedTo('bookable', Invoice::class)->where('bookable_id',
            $invoice->id)->first();

        $invoice->load('lines');
        $invoice->load('tax');
        $invoice->amount = $invoice->lines->sum('amount') + $invoice->lines->sum('tax');

        $outturnAccount = BookkeepingAccount::where('account_number', $invoice->tax->outturn_account_id)->first();

        $accounts = Contact::getAccounts(true, $invoice->contact_id, true, true);

        if ($invoice->is_loss_of_receivables) {
            $outturnAccount = BookkeepingAccount::where('account_number', 2400)->first();
        }

        $booking = BookkeepingBooking::createBooking($invoice, 'issued_on', 'amount', $accounts['subledgerAccount'],
            $outturnAccount, 'A', $booking?->id);

        if ($booking) {
            $name = strtoupper($accounts['name']);
            $booking->booking_text = "Rechnungsausgang|$name|$invoice->formatedInvoiceNumber";
            $booking->save();
        }

        return $booking;
    }
}
