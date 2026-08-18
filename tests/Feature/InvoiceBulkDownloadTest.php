<?php

use App\Jobs\DownloadJob;
use App\Models\DocumentDownload;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Support\Facades\Queue;
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
});

afterEach(function () {
    Tenancy::end();
});

it('creates an invoice download from ids sent in the request body', function () {
    Tenancy::end();

    Queue::fake();

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/invoicing/invoices/bulk-download', ['ids' => '1,2,3']);

    $response->assertRedirect();

    $download = DocumentDownload::query()->first();

    expect($download)->not->toBeNull()
        ->and($download->type)->toBe('invoice')
        ->and($download->ids)->toBe(['1', '2', '3']);

    Queue::assertPushed(DownloadJob::class);
});

it('creates an invoice download from ids sent in the query string', function () {
    Tenancy::end();

    Queue::fake();

    $response = $this
        ->actingAs($this->user)
        ->withServerVariables(['HTTP_HOST' => $this->domain->domain])
        ->put('http://'.$this->domain->domain.'/app/invoicing/invoices/bulk-download?ids=4,5');

    $response->assertRedirect();

    $download = DocumentDownload::query()->first();

    expect($download)->not->toBeNull()
        ->and($download->type)->toBe('invoice')
        ->and($download->ids)->toBe(['4', '5']);

    Queue::assertPushed(DownloadJob::class);
});
