<?php

use App\Models\Contact;
use App\Models\Invoice;
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

    $this->user = User::factory()->create();
    $this->actingAs($this->user);
});

afterEach(function () {
    Tenancy::end();
});

it('computes consistent totals between amount_gross and taxBreakdown after updatePositions', function () {
    $tax = Tax::unguarded(fn () => Tax::create([
        'name' => 'Umsatzsteuer',
        'invoice_text' => 'Umsatzsteuer 19%',
        'value' => 19,
        'needs_vat_id' => false,
        'is_default' => true,
        'is_used_in_invoicing' => true,
        'outturn_account_id' => 0,
        'default_rate_id' => 0,
    ]));

    $taxRate = TaxRate::unguarded(fn () => TaxRate::create([
        'tax_id' => $tax->id,
        'rate' => 19.00,
        'name' => '19%',
        'outturn_account_id' => 0,
    ]));

    $tax->default_rate_id = $taxRate->id;
    $tax->save();

    $contact = Contact::factory()->create();

    $invoice = Invoice::create([
        'contact_id' => $contact->id,
        'issued_on' => now(),
    ]);

    $linesData = [
        ['id' => 0, 'type_id' => 1, 'quantity' => 1, 'price' => 8.75, 'amount' => 8.75, 'tax_rate_id' => $taxRate->id, 'text' => 'Pos 1', 'pos' => 0, 'unit' => 'Stk'],
        ['id' => 0, 'type_id' => 1, 'quantity' => 1, 'price' => 8.75, 'amount' => 8.75, 'tax_rate_id' => $taxRate->id, 'text' => 'Pos 2', 'pos' => 1, 'unit' => 'Stk'],
        ['id' => 0, 'type_id' => 1, 'quantity' => 1, 'price' => 3.25, 'amount' => 3.25, 'tax_rate_id' => $taxRate->id, 'text' => 'Pos 3', 'pos' => 2, 'unit' => 'Stk'],
        ['id' => 0, 'type_id' => 1, 'quantity' => 1, 'price' => 7.48, 'amount' => 7.48, 'tax_rate_id' => $taxRate->id, 'text' => 'Pos 4', 'pos' => 3, 'unit' => 'Stk'],
        ['id' => 0, 'type_id' => 1, 'quantity' => 1, 'price' => 7.48, 'amount' => 7.48, 'tax_rate_id' => $taxRate->id, 'text' => 'Pos 5', 'pos' => 4, 'unit' => 'Stk'],
        ['id' => 0, 'type_id' => 1, 'quantity' => 1, 'price' => 7.48, 'amount' => 7.48, 'tax_rate_id' => $taxRate->id, 'text' => 'Pos 6', 'pos' => 5, 'unit' => 'Stk'],
    ];

    $invoice->updatePositions($linesData);

    $invoice = Invoice::query()
        ->withSum('lines', 'amount')
        ->withSum('lines', 'tax')
        ->with('lines.rate')
        ->where('id', $invoice->id)
        ->first();

    $taxes = $invoice->taxBreakdown($invoice->lines);

    $expectedNet = 43.19;
    $expectedTax = 8.21;
    $expectedGross = 51.40;

    $taxBreakdownSum = collect($taxes)->sum(fn ($t) => round($t['sum'], 2));

    expect(round($taxBreakdownSum, 2))->toBe($expectedTax);
    expect($invoice->amount_net)->toBe($expectedNet);
    expect($invoice->amount_tax)->toBe($expectedTax);
    expect($invoice->amount_gross)->toBe($expectedGross);

    // Verify stored values are properly rounded
    $invoice->lines->each(function ($line) {
        expect(round($line->tax, 2))->toEqual($line->tax);
        expect(round($line->amount, 2))->toEqual($line->amount);
    });

    // Verify ZugferdService getSummation logic consistency
    $lineTotal = round($invoice->lines->sum(fn ($l) => round($l->amount, 2)), 2);
    $taxTotal = round(collect($taxes)->sum(fn ($t) => round($t['sum'], 2)), 2);

    expect($lineTotal)->toBe($expectedNet);
    expect($taxTotal)->toBe($expectedTax);
    expect(round($lineTotal + $taxTotal, 2))->toBe($expectedGross);
});

it('ensures storeExternalInvoice rounds tax correctly', function () {
    $tax = Tax::unguarded(fn () => Tax::create([
        'name' => 'Umsatzsteuer',
        'invoice_text' => 'Umsatzsteuer 19%',
        'value' => 19,
        'needs_vat_id' => false,
        'is_default' => true,
        'is_used_in_invoicing' => true,
        'outturn_account_id' => 0,
        'default_rate_id' => 0,
    ]));

    $taxRate = TaxRate::unguarded(fn () => TaxRate::create([
        'tax_id' => $tax->id,
        'rate' => 19.00,
        'name' => '19%',
        'outturn_account_id' => 0,
    ]));

    $tax->default_rate_id = $taxRate->id;
    $tax->save();

    $contact = Contact::factory()->create();

    $invoice = Invoice::create([
        'contact_id' => $contact->id,
        'issued_on' => now(),
        'tax_id' => $tax->id,
    ]);

    $amount = 43.19;
    $invoice->lines()->create([
        'pos' => 1,
        'type_id' => 3,
        'text' => 'Externe Rechnung',
        'amount' => $amount,
        'tax_id' => $tax->id,
        'tax' => round($amount / 100 * $taxRate->rate, 2),
        'tax_rate_id' => $taxRate->id,
    ]);

    $invoice = Invoice::query()
        ->withSum('lines', 'amount')
        ->withSum('lines', 'tax')
        ->with('lines.rate')
        ->where('id', $invoice->id)
        ->first();

    // 43.19 * 0.19 = 8.2061, rounded to 8.21 per-line
    expect($invoice->amount_tax)->toBe(8.21);
    expect($invoice->amount_gross)->toBe(51.40);
});

it('uses aggregate rounding when lines are loaded, matching the XRechnung validator expectation', function () {
    $tax = Tax::unguarded(fn () => Tax::create([
        'name' => 'Umsatzsteuer',
        'invoice_text' => 'Umsatzsteuer 19%',
        'value' => 19,
        'needs_vat_id' => false,
        'is_default' => true,
        'is_used_in_invoicing' => true,
        'outturn_account_id' => 0,
        'default_rate_id' => 0,
    ]));

    $taxRate = TaxRate::unguarded(fn () => TaxRate::create([
        'tax_id' => $tax->id,
        'rate' => 19.00,
        'name' => '19%',
        'outturn_account_id' => 0,
    ]));

    $tax->default_rate_id = $taxRate->id;
    $tax->save();

    $contact = Contact::factory()->create();

    $invoice = Invoice::create([
        'contact_id' => $contact->id,
        'issued_on' => now(),
    ]);

    // Store unrounded tax values (simulating old code paths before fix)
    $amounts = [8.75, 8.75, 3.25, 7.48, 7.48, 7.48];
    foreach ($amounts as $pos => $amount) {
        $unroundedTax = $amount / 100 * $taxRate->rate;
        $invoice->lines()->create([
            'pos' => $pos + 1,
            'type_id' => 1,
            'quantity' => 1,
            'price' => $amount,
            'unit' => 'Stk',
            'amount' => $amount,
            'tax_rate_id' => $taxRate->id,
            'text' => 'Pos '.($pos + 1),
            'tax' => $unroundedTax,
        ]);
    }

    // When lines ARE loaded — uses aggregate rounding → 8.21 (matches validator)
    $invoiceWithLines = Invoice::query()
        ->withSum('lines', 'amount')
        ->withSum('lines', 'tax')
        ->with('lines.rate')
        ->where('id', $invoice->id)
        ->first();

    $taxes = $invoiceWithLines->taxBreakdown($invoiceWithLines->lines);
    $taxBreakdownSum = collect($taxes)->sum(fn ($t) => round($t['sum'], 2));

    // Aggregate rounding: round(43.19 * 19 / 100, 2) = round(8.2061, 2) = 8.21
    expect(round($taxBreakdownSum, 2))->toBe(8.21);
    expect($invoiceWithLines->amount_tax)->toBe(8.21);
    expect($invoiceWithLines->amount_gross)->toBe(51.40);

    // When lines are NOT loaded — SQL aggregate also gives 8.21
    $invoiceWithoutLines = Invoice::query()
        ->withSum('lines', 'amount')
        ->withSum('lines', 'tax')
        ->where('id', $invoice->id)
        ->first();

    expect($invoiceWithoutLines->amount_tax)->toBe(8.21);
    expect($invoiceWithoutLines->amount_gross)->toBe(51.40);
});
