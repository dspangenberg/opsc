<?php

use App\Models\DocumentDownload;
use App\Models\Tenant;
use Illuminate\Support\Facades\Artisan;
use Plank\Mediable\Facades\MediaUploader;
use Plank\Mediable\Media;
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
});

afterEach(function () {
    Tenancy::end();
});

function attachDownloadMedia(DocumentDownload $download): void
{
    $tmp = tempnam(sys_get_temp_dir(), 'download-').'.txt';
    file_put_contents($tmp, 'test content');

    try {
        $media = MediaUploader::fromSource($tmp)
            ->toDestination('public', 'downloads')
            ->useFilename('download-'.$download->id)
            ->upload();

        $download->attachMedia($media, 'file');
    } finally {
        @unlink($tmp);
    }
}

function runDownloadsDeleteCommand(): int
{
    return Artisan::call('downloads:delete');
}

it('deletes old downloads including their media', function () {
    $download = DocumentDownload::factory()->create([
        'created_at' => now()->subHours(2),
    ]);
    attachDownloadMedia($download);

    $exitCode = runDownloadsDeleteCommand();

    expect($exitCode)->toBe(0)
        ->and(DocumentDownload::find($download->id))->toBeNull()
        ->and(Media::count())->toBe(0);
});

it('deletes old downloads without media without failing', function () {
    $download = DocumentDownload::factory()->create([
        'created_at' => now()->subHours(2),
    ]);

    $exitCode = runDownloadsDeleteCommand();

    expect($exitCode)->toBe(0)
        ->and(DocumentDownload::find($download->id))->toBeNull();
});

it('keeps fresh downloads', function () {
    $download = DocumentDownload::factory()->create();
    attachDownloadMedia($download);

    $exitCode = runDownloadsDeleteCommand();

    expect($exitCode)->toBe(0)
        ->and(DocumentDownload::find($download->id))->not->toBeNull()
        ->and($download->fresh()->firstMedia('file'))->not->toBeNull();
});

it('keeps old downloads with orphaned media references', function () {
    $download = DocumentDownload::factory()->create([
        'created_at' => now()->subHours(2),
    ]);
    attachDownloadMedia($download);

    $download->media()->detach();

    $exitCode = runDownloadsDeleteCommand();

    expect($exitCode)->toBe(0)
        ->and(DocumentDownload::find($download->id))->toBeNull();
});
