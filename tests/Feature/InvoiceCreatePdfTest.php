<?php

use App\Facades\PdfService;
use App\Facades\ZugferdService;
use App\Models\BankAccount;
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
use App\Models\Time;
use App\Models\TimeCategory;
use Plank\Mediable\Facades\MediaUploader;
use Plank\Mediable\Media;
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

    $this->tax = Tax::create([
        'name' => 'MwSt.',
        'invoice_text' => 'USt.',
        'value' => 19,
        'needs_vat_id' => false,
        'is_default' => true,
        'outturn_account_id' => 0,
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
        'tax_id' => $this->tax->id,
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

    $this->bankAccount = BankAccount::create([
        'name' => 'Geschäftskonto',
        'iban' => 'DE89370400440532013000',
        'bic' => 'COBADEFFXXX',
        'account_owner' => 'Testfirma GmbH',
        'bank_name' => 'Commerzbank',
        'is_default' => true,
        'prefix' => 'BB',
        'pos' => 1,
    ]);

    $this->numberRange = NumberRange::create([
        'name' => 'Rechnungen',
        'prefix' => 'INV-'.uniqid(),
        'model' => Invoice::class,
    ]);

    $this->numberRangeDocumentNumber = NumberRangeDocumentNumber::create([
        'number_range_id' => $this->numberRange->id,
        'year' => now()->year,
        'counter' => 1,
        'document_number' => '202500001',
    ]);
});

afterEach(function () {
    Tenancy::end();
});

function createInvoice(array $overrides = []): Invoice
{
    return Invoice::forceCreate(array_merge([
        'contact_id' => test()->contact->id,
        'issued_on' => now()->toDateString(),
        'due_on' => now()->addDays(14)->toDateString(),
        'payment_deadline_id' => test()->paymentDeadline->id,
        'type_id' => test()->invoiceType->id,
        'tax_id' => test()->tax->id,
        'is_draft' => true,
        'is_external' => false,
        'number_range_document_numbers_id' => test()->numberRangeDocumentNumber->id,
        'invoice_number' => 202500001,
    ], $overrides));
}

function createInvoiceLine(Invoice $invoice, array $overrides = []): InvoiceLine
{
    return InvoiceLine::create(array_merge([
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
    ], $overrides));
}

function createTestMedia(string $filename = 'test.pdf'): Media
{
    return Media::forceCreate([
        'disk' => 's3_private',
        'directory' => 'invoices/'.now()->year,
        'filename' => $filename,
        'extension' => 'pdf',
        'aggregate_type' => 'file',
        'mime_type' => 'application/pdf',
        'size' => 100,
    ]);
}

function makeTestPdf(): string
{
    $path = tempnam(sys_get_temp_dir(), 'test-pdf-');
    file_put_contents($path, '%PDF-1.4 test content');

    return $path;
}

it('returns a valid file path for a draft invoice', function () {
    $invoice = createInvoice(['is_draft' => true]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    $result = Invoice::createOrGetPdf($invoice);

    expect($result)->toBe($testPdf)
        ->and(file_exists($result))->toBeTrue();

    @unlink($testPdf);
});

it('sets watermark to ENTWURF for draft invoices', function () {
    $invoice = createInvoice(['is_draft' => true]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::type('array'), Mockery::on(function ($config) {
            return $config['watermark'] === 'ENTWURF' && $config['pdfA'] === false;
        }))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('does not set watermark for non-draft invoices', function () {
    $invoice = createInvoice(['is_draft' => false]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::type('array'), Mockery::on(function ($config) {
            return $config['watermark'] === false && $config['pdfA'] === true;
        }))
        ->andReturn($testPdf);

    $mockMedia = createTestMedia('test-upload.pdf');

    MediaUploader::shouldReceive('fromSource')->andReturnSelf();
    MediaUploader::shouldReceive('useFilename')->andReturnSelf();
    MediaUploader::shouldReceive('toDestination')->andReturnSelf();
    MediaUploader::shouldReceive('upload')->once()->andReturn($mockMedia);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('passes invoice data to PdfService', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice, [
        'quantity' => 2,
        'price' => 200,
        'amount' => 400,
        'tax' => 76,
    ]);

    $testPdf = makeTestPdf();
    $capturedData = null;

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) use (&$capturedData) {
            $capturedData = $data;

            return true;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    expect($capturedData)->not->toBeNull()
        ->and($capturedData['invoice'])->toBeInstanceOf(Invoice::class)
        ->and(isset($capturedData['taxes']))->toBeTrue()
        ->and($capturedData['bank_account'])->toBeInstanceOf(BankAccount::class);

    @unlink($testPdf);
});

it('loads all required relationships', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();
    $capturedData = null;

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) use (&$capturedData) {
            $capturedData = $data;

            return true;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    expect($capturedData)->not->toBeNull()
        ->and($capturedData['invoice']->relationLoaded('contact'))->toBeTrue()
        ->and($capturedData['invoice']->relationLoaded('lines'))->toBeTrue()
        ->and($capturedData['invoice']->relationLoaded('type'))->toBeTrue()
        ->and($capturedData['invoice']->relationLoaded('payment_deadline'))->toBeTrue()
        ->and($capturedData['invoice']->contact->relationLoaded('tax'))->toBeTrue();

    @unlink($testPdf);
});

it('filters linked invoices from display lines', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice, ['type_id' => 0, 'pos' => 1]);
    createInvoiceLine($invoice, ['type_id' => 9, 'pos' => 2, 'amount' => 50, 'tax' => 9.50]);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) {
            $displayLines = $data['invoice']->lines;
            $linkedLines = $data['invoice']->linked_invoices;

            return $displayLines->count() === 1
                && $displayLines->first()->type_id === 0
                && $linkedLines->count() === 1
                && $linkedLines->first()->type_id === 9;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('computes tax breakdown for invoice lines', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice, ['amount' => 100, 'tax' => 19]);
    createInvoiceLine($invoice, ['amount' => 200, 'tax' => 38, 'pos' => 2]);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) {
            return is_array($data['taxes'])
                && count($data['taxes']) > 0;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('generates QR code SVG when invoice has a positive amount', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice, ['amount' => 100, 'tax' => 19]);

    $testPdf = makeTestPdf();
    $capturedData = null;

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) use (&$capturedData) {
            $capturedData = $data;

            return true;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    expect($capturedData)->not->toBeNull()
        ->and(is_string($capturedData['qr_code_svg']))->toBeTrue()
        ->and(str_starts_with($capturedData['qr_code_svg'], '<'))->toBeTrue();

    @unlink($testPdf);
});

it('does not generate QR code when invoice amount is zero', function () {
    $contact = Contact::create(['name' => 'Temp', 'debtor_number' => 99999, 'tax_id' => 0]);
    $invoice = createInvoice(['contact_id' => $contact->id]);
    createInvoiceLine($invoice, ['amount' => 0, 'tax' => 0]);

    $testPdf = makeTestPdf();
    $capturedData = null;

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) use (&$capturedData) {
            $capturedData = $data;

            return true;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    expect($capturedData)->not->toBeNull()
        ->and($capturedData['qr_code_svg'])->toBeNull();

    @unlink($testPdf);
});

it('generates Zugferd XML for non-draft zugferd invoices', function () {
    $invoice = createInvoice([
        'is_draft' => false,
        'is_zugferd' => true,
    ]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();
    $zugferdPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    ZugferdService::shouldReceive('generateZugferdXml')
        ->once()
        ->with($testPdf, Mockery::type(Invoice::class), Mockery::type('array'), Mockery::type(BankAccount::class))
        ->andReturn($zugferdPdf);

    $mockMedia = createTestMedia('test-zugferd.pdf');

    MediaUploader::shouldReceive('fromSource')->andReturnSelf();
    MediaUploader::shouldReceive('useFilename')->andReturnSelf();
    MediaUploader::shouldReceive('toDestination')->andReturnSelf();
    MediaUploader::shouldReceive('upload')->once()->andReturn($mockMedia);

    $result = Invoice::createOrGetPdf($invoice);

    expect($result)->toBe($zugferdPdf);

    @unlink($testPdf);
    @unlink($zugferdPdf);
});

it('does not generate Zugferd XML for draft invoices', function () {
    $invoice = createInvoice([
        'is_draft' => true,
        'is_zugferd' => true,
    ]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    ZugferdService::shouldReceive('generateZugferdXml', 0);

    $result = Invoice::createOrGetPdf($invoice);

    expect($result)->toBe($testPdf);

    @unlink($testPdf);
});

it('accepts a custom watermark parameter', function () {
    $invoice = createInvoice(['is_draft' => true]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::type('array'), Mockery::on(function ($config) {
            return $config['watermark'] === 'STORNIERT';
        }))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice, 'STORNIERT');

    @unlink($testPdf);
});

it('does not upload media for draft invoices', function () {
    $invoice = createInvoice(['is_draft' => true]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    MediaUploader::shouldReceive('fromSource', 0);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('uses default bank account for PDF data', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) {
            return $data['bank_account']->iban === 'DE89370400440532013000'
                && $data['bank_account']->bic === 'COBADEFFXXX'
                && $data['bank_account']->bank_name === 'Commerzbank';
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('passes times sum and grouped data to PdfService', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice);

    $category = TimeCategory::create([
        'name' => 'Programmierung',
        'short_name' => 'PROG',
        'pos' => 1,
        'hourly' => 80,
    ]);

    Time::create([
        'project_id' => 0,
        'time_category_id' => $category->id,
        'user_id' => 0,
        'invoice_id' => $invoice->id,
        'begin_at' => now()->subHours(2),
        'end_at' => now()->subHour(),
        'minutes' => 120,
    ]);

    $testPdf = makeTestPdf();
    $capturedData = null;

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) use (&$capturedData) {
            $capturedData = $data;

            return true;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    expect($capturedData)->not->toBeNull()
        ->and($capturedData['timesSum'])->toBeInt()
        ->and($capturedData['timesSum'])->toBeGreaterThan(0)
        ->and($capturedData['groupedTimes'])->toBeArray()
        ->and($capturedData['groupedByCategoryTimes'])->toBeArray();

    @unlink($testPdf);
});

it('passes empty times data when invoice has no times', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();
    $capturedData = null;

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) use (&$capturedData) {
            $capturedData = $data;

            return true;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    expect($capturedData)->not->toBeNull()
        ->and($capturedData['timesSum'])->toBe(0)
        ->and($capturedData['groupedTimes'])->toBeArray()->toBeEmpty()
        ->and($capturedData['groupedByCategoryTimes'])->toBeArray()->toBeEmpty();

    @unlink($testPdf);
});

it('passes hide config as true', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::type('array'), Mockery::on(function ($config) {
            return $config['hide'] === true;
        }))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('uploads media for non-draft invoices', function () {
    $invoice = createInvoice(['is_draft' => false]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();
    $fileNamePrefix = str_replace('.pdf', '', $invoice->filename);

    $mockMedia = createTestMedia('test-upload.pdf');

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    MediaUploader::shouldReceive('fromSource')->once()->with($testPdf)->andReturnSelf();
    MediaUploader::shouldReceive('useFilename')->once()->with(Mockery::on(fn ($name) => str_starts_with($name, $fileNamePrefix.'_')))->andReturnSelf();
    MediaUploader::shouldReceive('toDestination')->once()->with('s3_private', 'invoices/'.now()->year)->andReturnSelf();
    MediaUploader::shouldReceive('upload')->once()->andReturn($mockMedia);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('calls attachMedia on invoice after uploading pdf for non-draft', function () {
    $invoice = createInvoice(['is_draft' => false]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    $mockMedia = createTestMedia('test-attach.pdf');

    MediaUploader::shouldReceive('fromSource')->once()->with($testPdf)->andReturnSelf();
    MediaUploader::shouldReceive('useFilename')->once()->andReturnSelf();
    MediaUploader::shouldReceive('toDestination')->once()->andReturnSelf();
    MediaUploader::shouldReceive('upload')->once()->andReturn($mockMedia);

    $result = Invoice::createOrGetPdf($invoice);

    expect($result)->toBeString();

    @unlink($testPdf);
});

it('skips media upload entirely for draft invoices', function () {
    $invoice = createInvoice(['is_draft' => true]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    MediaUploader::shouldReceive('fromSource', 0);

    Invoice::createOrGetPdf($invoice);

    @unlink($testPdf);
});

it('returns zugferd xml path over pdf path when zugferd is generated', function () {
    $invoice = createInvoice([
        'is_draft' => false,
        'is_zugferd' => true,
    ]);
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();
    $zugferdPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($testPdf);

    ZugferdService::shouldReceive('generateZugferdXml')
        ->once()
        ->andReturn($zugferdPdf);

    MediaUploader::shouldReceive('fromSource')->andReturnSelf();
    MediaUploader::shouldReceive('useFilename')->andReturnSelf();
    MediaUploader::shouldReceive('toDestination')->andReturnSelf();

    $mockMedia = createTestMedia('test-zugferd-path.pdf');
    MediaUploader::shouldReceive('upload')->andReturn($mockMedia);

    $result = Invoice::createOrGetPdf($invoice);

    expect($result)->toBe($zugferdPdf)
        ->and($result)->not->toBe($testPdf);

    @unlink($testPdf);
    @unlink($zugferdPdf);
});

it('uses pdfA config based on draft status', function () {
    $draftInvoice = createInvoice(['is_draft' => true]);
    createInvoiceLine($draftInvoice);

    $testPdf = makeTestPdf();

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::type('array'), Mockery::on(function ($config) {
            return $config['pdfA'] === false;
        }))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($draftInvoice);

    @unlink($testPdf);
});

it('creates invoice line with rate relationship loaded', function () {
    $invoice = createInvoice();
    createInvoiceLine($invoice);

    $testPdf = makeTestPdf();
    $capturedData = null;

    PdfService::shouldReceive('createPdf')
        ->once()
        ->with('invoice', 'pdf.invoice.index', Mockery::on(function ($data) use (&$capturedData) {
            $capturedData = $data;

            return true;
        }), Mockery::type('array'))
        ->andReturn($testPdf);

    Invoice::createOrGetPdf($invoice);

    expect($capturedData)->not->toBeNull()
        ->and($capturedData['invoice']->lines)->not->toBeEmpty();

    $firstLine = $capturedData['invoice']->lines->first();
    expect($firstLine->relationLoaded('rate'))->toBeTrue();

    @unlink($testPdf);
});
