<?php

use App\Facades\WeasyPdfService;
use App\Http\Controllers\App\InvoiceController;
use App\Http\Requests\InvoiceReportRequest;
use App\Models\Invoice;
use Illuminate\Support\Collection;
use Mockery as m;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Tests\TestCase;

uses(TestCase::class);

test('invoice report query eagerly loads payable with constraints', function () {
    $file = tempnam(sys_get_temp_dir(), 'pdf');
    file_put_contents($file, 'test');

    WeasyPdfService::shouldReceive('createPdf')
        ->once()
        ->andReturn($file);

    $builder = m::mock();
    $builder->shouldReceive('with')
        ->with(m::on(function ($arg) {
            return is_array($arg)
                && array_key_exists('payable', $arg)
                && $arg['payable'] instanceof \Closure;
        }))
        ->once()
        ->andReturnSelf();
    $builder->shouldReceive('with')->withAnyArgs()->andReturnSelf();
    $builder->shouldReceive('withSum')->withAnyArgs()->andReturnSelf();
    $builder->shouldReceive('where')->withAnyArgs()->andReturnSelf();
    $builder->shouldReceive('whereBetween')->withAnyArgs()->andReturnSelf();
    $builder->shouldReceive('orderBy')->withAnyArgs()->andReturnSelf();
    $builder->shouldReceive('get')->andReturn(Collection::make());

    m::mock('alias:'.Invoice::class)
        ->shouldReceive('query')
        ->andReturn($builder);

    $request = m::mock(InvoiceReportRequest::class);
    $request->shouldReceive('validated')->with('begin_on')->andReturn('2025-01-01');
    $request->shouldReceive('validated')->with('end_on')->andReturn('2025-12-31');
    $request->shouldReceive('validated')->with('with_payments')->andReturn(false);

    $controller = app(InvoiceController::class);
    $response = $controller->createReport($request);

    expect($response)->toBeInstanceOf(BinaryFileResponse::class);

    unlink($file);
});
