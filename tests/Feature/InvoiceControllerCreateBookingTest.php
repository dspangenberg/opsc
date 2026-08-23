<?php

use App\Models\BookkeepingAccount;
use App\Models\BookkeepingBooking;
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
use App\Models\User;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->domain = Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-'.$this->tenant->id.'.test',
    ]);

    Tenancy::initialize($this->tenant);
    $this->artisan('tenants:migrate');

    $this->user = User::factory()->create(['password' => bcrypt('password')]);

    BookkeepingAccount::create([
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

    BookkeepingAccount::create([
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

function createBookingControllerInvoice(array $overrides = []): Invoice
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

it('creates booking and redirects to invoice details', function () {
    $invoice = createBookingControllerInvoice();

    Tenancy::end();

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/invoicing/invoices/'.$invoice->id.'/create_booking');

    $response->assertRedirect();

    Tenancy::initialize($this->tenant);

    $this->assertDatabaseHas('bookkeeping_bookings', [
        'bookable_type' => Invoice::class,
        'bookable_id' => $invoice->id,
        'amount' => 119.0,
    ]);
});

it('sets sent_at when creating booking', function () {
    $invoice = createBookingControllerInvoice(['sent_at' => null]);

    Tenancy::end();

    $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/invoicing/invoices/'.$invoice->id.'/create_booking');

    Tenancy::initialize($this->tenant);

    $invoice->refresh();

    expect($invoice->sent_at)->not->toBeNull();
});

it('does not create duplicate booking when one already exists', function () {
    $invoice = createBookingControllerInvoice();

    $existingBooking = $invoice->createBooking();
    expect($existingBooking)->not->toBeNull();
    $existingBookingId = $existingBooking->id;

    Tenancy::end();

    $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/invoicing/invoices/'.$invoice->id.'/create_booking');

    Tenancy::initialize($this->tenant);

    $this->assertDatabaseHas('bookkeeping_bookings', [
        'id' => $existingBookingId,
    ]);

    $count = BookkeepingBooking::where('bookable_type', Invoice::class)
        ->where('bookable_id', $invoice->id)
        ->count();

    expect($count)->toBe(1);
});

it('preserves existing sent_at when creating booking', function () {
    $originalSentAt = now()->subDays(5);
    $invoice = createBookingControllerInvoice(['sent_at' => $originalSentAt]);

    Tenancy::end();

    $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->get('http://'.$this->domain->domain.'/app/invoicing/invoices/'.$invoice->id.'/create_booking');

    Tenancy::initialize($this->tenant);

    $invoice->refresh();

    expect($invoice->sent_at->format('Y-m-d'))->toBe($originalSentAt->format('Y-m-d'));
});
