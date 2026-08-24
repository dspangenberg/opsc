<?php

use App\Facades\WeasyPdfService;
use App\Http\Controllers\App\InvoiceController;
use App\Http\Requests\InvoiceReportRequest;
use App\Models\Contact;
use App\Models\Invoice;
use Mockery as m;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

test('invoice report query eagerly loads payable with constraints', function () {
    $this->artisan('tenants:migrate');

    $contact = Contact::create(['name' => 'Testfirma GmbH']);

    Invoice::forceCreate([
        'contact_id' => $contact->id,
        'project_id' => 0,
        'issued_on' => '2025-06-01',
        'payment_deadline_id' => 0,
    ]);

    $pdf = tempnam(sys_get_temp_dir(), 'pdf');
    file_put_contents($pdf, 'test');

    WeasyPdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($pdf);

    $request = m::mock(InvoiceReportRequest::class);
    $request->shouldReceive('validated')->with('begin_on')->andReturn('2025-01-01');
    $request->shouldReceive('validated')->with('end_on')->andReturn('2025-12-31');
    $request->shouldReceive('validated')->with('with_payments')->andReturn(false);

    $connection = (new Invoice)->getConnection();
    $connection->enableQueryLog();

    $response = app(InvoiceController::class)->createReport($request);

    $queries = collect($connection->getQueryLog());
    $connection->disableQueryLog();

    expect($response)->toBeInstanceOf(BinaryFileResponse::class)
        ->and($queries->contains(
            fn (array $entry) => str_contains($entry['query'], 'from "payments"')
                && str_contains($entry['query'], 'order by "issued_on" asc'),
        ))->toBeTrue();

    @unlink($pdf);
});
