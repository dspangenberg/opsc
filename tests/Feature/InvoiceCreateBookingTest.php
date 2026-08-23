<?php

use App\Models\BookkeepingAccount;
use App\Models\BookkeepingBooking;
use App\Models\BookkeepingLog;
use App\Models\Contact;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use App\Models\InvoiceType;
use App\Models\NumberRange;
use App\Models\NumberRangeDocumentNumber;
use App\Models\PaymentDeadline;
use App\Models\Tax;
use App\Models\TaxRate;
use App\Models\Tenant;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-'.$this->tenant->id.'.test',
    ]);

    Tenancy::initialize($this->tenant);
    $this->artisan('tenants:migrate');

    $this->outturnAccount = BookkeepingAccount::create([
        'account_number' => 4400,
        'name' => 'Umsatzerlöse 19%',
        'type' => 'e',
        'is_default' => true,
    ]);

    $this->tax = Tax::create([
        'name' => 'MwSt.',
        'invoice_text' => 'USt.',
        'value' => 19,
        'needs_vat_id' => false,
        'is_default' => true,
        'outturn_account_id' => 4400,
        'default_rate_id' => 0,
    ]);

    $this->taxRate = TaxRate::create([
        'tax_id' => $this->tax->id,
        'rate' => 19,
        'name' => '19%',
        'outturn_account_id' => 0,
    ]);

    $this->contact = Contact::create([
        'name' => 'Testfirma GmbH',
        'debtor_number' => 10001,
        'is_debtor' => true,
        'tax_id' => $this->tax->id,
    ]);

    $this->debtorAccount = BookkeepingAccount::create([
        'account_number' => 10001,
        'name' => 'TESTFIRMA GMBH',
        'type' => 'd',
    ]);

    $this->invoiceType = InvoiceType::create([
        'print_name' => 'Rechnung',
        'display_name' => 'Rechnung',
        'key' => 'invoice',
        'abbreviation' => 'RG',
        'zugferd_id' => '380',
    ]);

    $this->paymentDeadline = PaymentDeadline::create([
        'name' => '14 Tage',
        'days' => 14,
        'is_default' => true,
        'is_immediately' => false,
        'invoice_text' => 'Zahlbar bis zum $dueDate.',
    ]);

    $this->numberRange = NumberRange::create([
        'name' => 'Rechnungen',
        'prefix' => 'INV-'.uniqid(),
        'model' => Invoice::class,
    ]);

    $this->numberRangeDocumentNumber = NumberRangeDocumentNumber::create([
        'number_range_id' => $this->numberRange->id,
        'year' => now()->year,
        'counter' => 0,
        'document_number' => '0',
    ]);
});

afterEach(function () {
    Tenancy::end();
});

function createBookingInvoice(array $overrides = []): Invoice
{
    $invoice = Invoice::forceCreate(array_merge([
        'contact_id' => test()->contact->id,
        'issued_on' => now()->toDateString(),
        'due_on' => now()->addDays(14)->toDateString(),
        'payment_deadline_id' => test()->paymentDeadline->id,
        'type_id' => test()->invoiceType->id,
        'tax_id' => test()->tax->id,
        'is_draft' => false,
        'is_external' => false,
        'number_range_document_numbers_id' => test()->numberRangeDocumentNumber->id,
        'invoice_number' => 202500001,
    ], $overrides));

    InvoiceLine::create([
        'invoice_id' => $invoice->id,
        'quantity' => 1,
        'unit' => 'Stk.',
        'text' => 'Testleistung',
        'price' => 100,
        'amount' => 100,
        'tax' => 19,
        'tax_rate_id' => test()->taxRate->id,
        'tax_id' => test()->tax->id,
        'type_id' => 0,
        'pos' => 1,
    ]);

    return $invoice;
}

it('creates a bookkeeping booking for an invoice', function () {
    $invoice = createBookingInvoice();

    $booking = $invoice->createBooking();

    expect($booking)->toBeInstanceOf(BookkeepingBooking::class)
        ->and($booking->id)->not->toBeNull()
        ->and($booking->bookable_type)->toBe(Invoice::class)
        ->and($booking->bookable_id)->toBe($invoice->id)
        ->and($booking->amount)->toBe(119.0)
        ->and($booking->account_id_debit)->toBe(10001)
        ->and($booking->account_id_credit)->toBe(4400)
        ->and($booking->date->format('Y-m-d'))->toBe($invoice->issued_on->format('Y-m-d'))
        ->and($booking->booking_text)->toContain('Rechnungsausgang')
        ->and($booking->booking_text)->toContain('TESTFIRMA GMBH');
});

it('assigns a document number when invoice has none', function () {
    $invoice = createBookingInvoice([
        'number_range_document_numbers_id' => null,
        'invoice_number' => null,
    ]);

    $booking = $invoice->createBooking();

    $invoice->refresh();

    expect($invoice->number_range_document_numbers_id)->not->toBeNull()
        ->and($booking->number_range_document_numbers_id)->toBe($invoice->number_range_document_numbers_id);
});

it('does not reassign document number when invoice already has one from the correct range', function () {
    $invoice = createBookingInvoice();
    $originalNrId = $invoice->number_range_document_numbers_id;

    $invoice->createBooking();

    $invoice->refresh();

    expect($invoice->number_range_document_numbers_id)->toBe($originalNrId);
});

it('reassigns document number when invoice has one from a different range', function () {
    $otherRange = NumberRange::create([
        'name' => 'Andere',
        'prefix' => 'AND-'.uniqid(),
        'model' => Invoice::class,
    ]);
    $otherDocNr = NumberRangeDocumentNumber::create([
        'number_range_id' => $otherRange->id,
        'year' => now()->year,
        'counter' => 1,
        'document_number' => 'AND-'.now()->year.'-1',
    ]);

    $invoice = createBookingInvoice([
        'number_range_document_numbers_id' => $otherDocNr->id,
    ]);

    $booking = $invoice->createBooking();

    $invoice->refresh();

    expect($invoice->number_range_document_numbers_id)->not->toBe($otherDocNr->id)
        ->and($booking->number_range_document_numbers_id)->toBe($invoice->number_range_document_numbers_id);
});

it('uses loss of receivables account when invoice is loss of receivables', function () {
    BookkeepingAccount::create([
        'account_number' => 2400,
        'name' => 'Einbringlichkeit zweifelhaft',
        'type' => 'd',
    ]);

    $invoice = createBookingInvoice([
        'is_loss_of_receivables' => true,
    ]);

    $booking = $invoice->createBooking();

    expect($booking->account_id_credit)->toBe(2400);
});

it('returns null and logs when outturn account is missing', function () {
    $tax = Tax::create([
        'name' => 'Ohne Konto',
        'invoice_text' => 'OK',
        'value' => 0,
        'needs_vat_id' => false,
        'is_default' => false,
        'outturn_account_id' => 9999,
        'default_rate_id' => 0,
    ]);

    $invoice = createBookingInvoice(['tax_id' => $tax->id]);

    $booking = $invoice->createBooking();

    expect($booking)->toBeNull();

    expect(BookkeepingLog::where('parent_model', Invoice::class)
        ->where('parent_id', $invoice->id)
        ->where('text', 'Habenkonto nicht gefunden')
        ->exists())->toBeTrue();
});

it('updates existing booking instead of creating a new one', function () {
    $invoice = createBookingInvoice();

    $firstBooking = $invoice->createBooking();
    $firstBooking->booking_text = 'Original';
    $firstBooking->save();

    $secondBooking = $invoice->createBooking();

    expect($secondBooking->id)->toBe($firstBooking->id)
        ->and(BookkeepingBooking::where('bookable_type', Invoice::class)
            ->where('bookable_id', $invoice->id)->count())->toBe(1);
});

it('does not overwrite a locked existing booking', function () {
    $invoice = createBookingInvoice();

    $existingBooking = $invoice->createBooking();
    $existingBooking->booking_text = 'Original';
    $existingBooking->is_locked = true;
    $existingBooking->save();

    $result = $invoice->createBooking();

    expect($result)->toBeNull();

    $booking = BookkeepingBooking::where('bookable_type', Invoice::class)
        ->where('bookable_id', $invoice->id)
        ->first();

    expect($booking->booking_text)->toBe('Original')
        ->and($booking->is_locked)->toBeTruthy();
});

it('computes amount as sum of lines amount plus tax', function () {
    $invoice = createBookingInvoice();

    InvoiceLine::create([
        'invoice_id' => $invoice->id,
        'quantity' => 2,
        'unit' => 'Stk.',
        'text' => 'Zweite Leistung',
        'price' => 50,
        'amount' => 100,
        'tax' => 19,
        'tax_rate_id' => test()->taxRate->id,
        'tax_id' => test()->tax->id,
        'type_id' => 0,
        'pos' => 2,
    ]);

    $booking = $invoice->createBooking();

    expect($booking->amount)->toBe(238.0);
});

it('sets booking_text with formatted invoice number', function () {
    $invoice = createBookingInvoice();

    $booking = $invoice->createBooking();

    expect($booking->booking_text)->toContain('Rechnungsausgang')
        ->and($booking->booking_text)->toContain('|');
});

it('does not create duplicate bookings for same invoice', function () {
    $invoice = createBookingInvoice();

    $invoice->createBooking();
    $invoice->createBooking();

    $count = BookkeepingBooking::where('bookable_type', Invoice::class)
        ->where('bookable_id', $invoice->id)
        ->count();

    expect($count)->toBe(1);
});
