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
use Illuminate\Database\Eloquent\Model;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    $this->domain = Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-'.$this->tenant->id.'.test',
    ]);

    Tenancy::initialize($this->tenant);
    $this->artisan('tenants:migrate', ['--tenants' => [$this->tenant->id]]);

    $this->user = User::factory()->create(['password' => bcrypt('password')]);

    BookkeepingAccount::factory()->create([
        'account_number' => 4400,
        'name' => 'Umsatzerlöse 19%',
        'type' => 'e',
    ]);

    $this->tax = Tax::factory()->create([
        'outturn_account_id' => 4400,
    ]);

    $this->taxRate = TaxRate::factory()->create([
        'tax_id' => $this->tax->id,
    ]);

    $this->contact = Contact::factory()->create([
        'name' => 'Testfirma GmbH',
        'debtor_number' => 10001,
        'is_debtor' => true,
        'tax_id' => $this->tax->id,
    ]);

    BookkeepingAccount::factory()->create([
        'account_number' => 10001,
        'name' => 'TESTFIRMA GMBH',
        'type' => 'd',
    ]);

    $this->invoiceType = InvoiceType::factory()->create();

    $this->paymentDeadline = PaymentDeadline::factory()->create();

    $this->numberRange = NumberRange::factory()->create();

    $this->numberRangeDocumentNumber = NumberRangeDocumentNumber::factory()->create([
        'number_range_id' => $this->numberRange->id,
    ]);
});

afterEach(function () {
    Tenancy::end();
});

function createBookingControllerInvoice(array $overrides = []): Invoice
{
    /** @var Invoice $invoice */
    $invoice = Model::unguarded(fn (): Invoice => Invoice::factory()->create(array_merge([
        'contact_id' => test()->contact->id,
        'issued_on' => now()->toDateString(),
        'due_on' => now()->addDays(14)->toDateString(),
        'payment_deadline_id' => test()->paymentDeadline->id,
        'type_id' => test()->invoiceType->id,
        'tax_id' => test()->tax->id,
        'number_range_document_numbers_id' => test()->numberRangeDocumentNumber->id,
        'invoice_number' => 202500001,
    ], $overrides)));

    InvoiceLine::factory()->create([
        'invoice_id' => $invoice->id,
        'tax_rate_id' => test()->taxRate->id,
        'tax_id' => test()->tax->id,
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
