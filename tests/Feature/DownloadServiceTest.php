<?php

use App\Facades\FileHelperService;
use App\Mail\DownloadEmail;
use App\Models\DocumentDownload;
use App\Models\Invoice;
use App\Models\NumberRange;
use App\Models\NumberRangeDocumentNumber;
use App\Models\Receipt;
use App\Models\Tax;
use App\Models\Tenant;
use App\Models\User;
use App\Services\DownloadService;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Plank\Mediable\Facades\MediaUploader;
use Stancl\Tenancy\Database\Models\Domain;
use Stancl\Tenancy\Facades\Tenancy;
use ZanySoft\Zip\Facades\Zip;

beforeEach(function () {
    $this->tenant = Tenant::factory()->create();
    Domain::create([
        'tenant_id' => $this->tenant->id,
        'domain' => 'tenant-'.$this->tenant->id.'.test',
    ]);

    Tenancy::initialize($this->tenant);
    $this->artisan('tenants:migrate', ['--tenants' => [$this->tenant->id]]);

    $this->user = User::factory()->create();
});

afterEach(function () {
    Tenancy::end();
});

function makeReceiptWithMedia(): Receipt
{
    $numberRange = NumberRange::create([
        'name' => 'Belege',
        'prefix' => 'BE-'.uniqid(),
        'model' => Receipt::class,
    ]);

    $numberRangeDocumentNumber = NumberRangeDocumentNumber::create([
        'number_range_id' => $numberRange->id,
        'year' => now()->year,
        'counter' => 1,
        'document_number' => 'RE-2026-001',
    ]);

    $receipt = Receipt::forceCreate([
        'issued_on' => now()->toDateString(),
        'org_filename' => 'test.pdf',
        'file_size' => 100,
        'file_created_at' => now(),
        'amount' => 10,
        'is_confirmed' => false,
        'reference' => 'Testbeleg',
        'iban' => '',
        'checksum' => '',
        'text' => '',
        'data' => [],
        'pages' => 1,
        'number_range_document_numbers_id' => $numberRangeDocumentNumber->id,
    ]);

    $tmp = tempnam(sys_get_temp_dir(), 'receipt-').'.txt';
    file_put_contents($tmp, 'test pdf content');

    try {
        $media = MediaUploader::fromSource($tmp)
            ->toDestination('public', 'receipts')
            ->useFilename('receipt-'.$receipt->id)
            ->upload();

        $receipt->attachMedia($media, 'file');
    } finally {
        @unlink($tmp);
    }

    return $receipt;
}

it('creates app temp files inside the application storage directory', function () {
    $path = FileHelperService::getAppTempFile('zip');

    expect($path)->toStartWith(storage_path('app/temp'))
        ->and(is_dir(storage_path('app/temp')))->toBeTrue();

    @unlink($path);
});

it('downloads a zip of receipts, uploads it and cleans up the temp file', function () {
    $originalStoragePath = storage_path();
    $storageDir = sys_get_temp_dir().'/download_test_'.uniqid();
    app()->useStoragePath($storageDir);

    Mail::fake();
    Storage::fake('s3_private');
    Storage::disk('s3_private')->buildTemporaryUrlsUsing(fn () => 'https://example.test/download.zip');

    $receipt = makeReceiptWithMedia();

    $download = DocumentDownload::create([
        'type' => 'receipt',
        'ids' => [$receipt->id],
    ]);

    try {
        (new DownloadService)->download($download->id, $this->user);

        $media = $download->fresh()->firstMedia('file');

        expect($media)->not->toBeNull()
            ->and($media->disk)->toBe('s3_private')
            ->and($media->directory)->toBe('downloads')
            ->and(Storage::disk('s3_private')->exists($media->getDiskPath()))->toBeTrue();

        Mail::assertSent(DownloadEmail::class, fn (DownloadEmail $mail) => $mail->hasTo($this->user->email));

        expect(glob(storage_path('app/temp').'/*.zip'))->toBe([]);

        $zipContent = Storage::disk('s3_private')->get($media->getDiskPath());
        $zipFile = tempnam(sys_get_temp_dir(), 'zip-check-').'.zip';
        file_put_contents($zipFile, $zipContent);

        try {
            $archive = new ZipArchive;
            $archive->open($zipFile);
            expect($archive->locateName($receipt->issued_on->format('Ymd-').$receipt->document_number.'.pdf'))
                ->not->toBe(false);
            $archive->close();
        } finally {
            @unlink($zipFile);
        }
    } finally {
        app()->useStoragePath($originalStoragePath);
        app('files')->deleteDirectory($storageDir);
    }
});

it('adds a placeholder entry for receipts without media', function () {
    $originalStoragePath = storage_path();
    $storageDir = sys_get_temp_dir().'/download_test_'.uniqid();
    app()->useStoragePath($storageDir);

    Mail::fake();
    Storage::fake('s3_private');
    Storage::disk('s3_private')->buildTemporaryUrlsUsing(fn () => 'https://example.test/download.zip');

    $numberRange = NumberRange::create([
        'name' => 'Belege',
        'prefix' => 'BE-'.uniqid(),
        'model' => Receipt::class,
    ]);

    $numberRangeDocumentNumber = NumberRangeDocumentNumber::create([
        'number_range_id' => $numberRange->id,
        'year' => now()->year,
        'counter' => 1,
        'document_number' => 'RE-2026-002',
    ]);

    $receipt = Receipt::forceCreate([
        'issued_on' => now()->toDateString(),
        'org_filename' => 'test.pdf',
        'file_size' => 100,
        'file_created_at' => now(),
        'amount' => 10,
        'is_confirmed' => false,
        'reference' => 'Ohne Medien',
        'iban' => '',
        'checksum' => '',
        'text' => '',
        'data' => [],
        'pages' => 1,
        'number_range_document_numbers_id' => $numberRangeDocumentNumber->id,
    ]);

    $download = DocumentDownload::create([
        'type' => 'receipt',
        'ids' => [$receipt->id],
    ]);

    try {
        (new DownloadService)->download($download->id, $this->user);

        $media = $download->fresh()->firstMedia('file');
        $zipContent = Storage::disk('s3_private')->get($media->getDiskPath());
        $zipFile = tempnam(sys_get_temp_dir(), 'zip-check-').'.zip';
        file_put_contents($zipFile, $zipContent);

        try {
            $archive = new ZipArchive;
            $archive->open($zipFile);
            expect($archive->locateName('missing-media-'.$receipt->id.'.pdf'))->not->toBe(false);
            $archive->close();
        } finally {
            @unlink($zipFile);
        }
    } finally {
        app()->useStoragePath($originalStoragePath);
        app('files')->deleteDirectory($storageDir);
    }
});

it('skips the upload and the email when the download has no items', function () {
    $originalStoragePath = storage_path();
    $storageDir = sys_get_temp_dir().'/download_test_'.uniqid();
    app()->useStoragePath($storageDir);

    Mail::fake();
    Storage::fake('s3_private');

    $download = DocumentDownload::create([
        'type' => 'receipt',
        'ids' => [],
    ]);

    $zipMock = Mockery::mock(ZanySoft\Zip\Zip::class);
    $zipMock->shouldReceive('close')->once();

    Zip::shouldReceive('create')->once()->andReturn($zipMock);

    try {
        (new DownloadService)->download($download->id, $this->user);

        expect($download->fresh()->firstMedia('file'))->toBeNull();
        Mail::assertNothingSent();
    } finally {
        app()->useStoragePath($originalStoragePath);
        app('files')->deleteDirectory($storageDir);
    }
});

it('includes receipts with media but without a document number', function () {
    $originalStoragePath = storage_path();
    $storageDir = sys_get_temp_dir().'/download_test_'.uniqid();
    app()->useStoragePath($storageDir);

    Mail::fake();
    Storage::fake('s3_private');
    Storage::disk('s3_private')->buildTemporaryUrlsUsing(fn () => 'https://example.test/download.zip');

    $receipt = Receipt::forceCreate([
        'issued_on' => now()->toDateString(),
        'org_filename' => 'test.pdf',
        'file_size' => 100,
        'file_created_at' => now(),
        'amount' => 10,
        'is_confirmed' => false,
        'reference' => 'Ohne Dokumentnummer',
        'iban' => '',
        'checksum' => '',
        'text' => '',
        'data' => [],
        'pages' => 1,
        'number_range_document_numbers_id' => null,
    ]);

    $tmp = tempnam(sys_get_temp_dir(), 'receipt-').'.txt';
    file_put_contents($tmp, 'test pdf content');

    try {
        $media = MediaUploader::fromSource($tmp)
            ->toDestination('public', 'receipts')
            ->useFilename('receipt-'.$receipt->id)
            ->upload();

        $receipt->attachMedia($media, 'file');
    } finally {
        @unlink($tmp);
    }

    $download = DocumentDownload::create([
        'type' => 'receipt',
        'ids' => [$receipt->id],
    ]);

    try {
        (new DownloadService)->download($download->id, $this->user);

        $media = $download->fresh()->firstMedia('file');
        $zipContent = Storage::disk('s3_private')->get($media->getDiskPath());
        $zipFile = tempnam(sys_get_temp_dir(), 'zip-check-').'.zip';
        file_put_contents($zipFile, $zipContent);

        try {
            $archive = new ZipArchive;
            $archive->open($zipFile);
            expect($archive->locateName($receipt->issued_on->format('Ymd-').'receipt-'.$receipt->id.'.txt'))
                ->not->toBe(false);
            $archive->close();
        } finally {
            @unlink($zipFile);
        }

        Mail::assertSent(DownloadEmail::class);
    } finally {
        app()->useStoragePath($originalStoragePath);
        app('files')->deleteDirectory($storageDir);
    }
});

it('downloads a zip of invoices using their pdf media', function () {
    $originalStoragePath = storage_path();
    $storageDir = sys_get_temp_dir().'/download_test_'.uniqid();
    app()->useStoragePath($storageDir);

    Mail::fake();
    Storage::fake('s3_private');
    Storage::disk('s3_private')->buildTemporaryUrlsUsing(fn () => 'https://example.test/download.zip');

    $tax = Tax::query()->first() ?? Tax::create([
        'name' => 'MwSt.',
        'invoice_text' => 'USt.',
        'value' => 19,
        'needs_vat_id' => false,
        'is_default' => true,
        'outturn_account_id' => 0,
        'default_rate_id' => 0,
    ]);

    $numberRange = NumberRange::create([
        'name' => 'Rechnungen',
        'prefix' => 'INV-'.uniqid(),
        'model' => Invoice::class,
    ]);

    $numberRangeDocumentNumber = NumberRangeDocumentNumber::create([
        'number_range_id' => $numberRange->id,
        'year' => now()->year,
        'counter' => 1,
        'document_number' => 'INV-2026-001',
    ]);

    $invoice = Invoice::forceCreate([
        'contact_id' => 0,
        'issued_on' => now()->toDateString(),
        'due_on' => now()->toDateString(),
        'payment_deadline_id' => 0,
        'type_id' => 1,
        'tax_id' => $tax->id,
        'is_draft' => false,
        'is_external' => false,
        'number_range_document_numbers_id' => $numberRangeDocumentNumber->id,
    ]);

    $tmp = tempnam(sys_get_temp_dir(), 'invoice-').'.pdf';
    file_put_contents($tmp, 'invoice pdf content');

    try {
        $media = MediaUploader::fromSource($tmp)
            ->toDestination('public', 'invoices')
            ->useFilename('invoice-'.$invoice->id)
            ->upload();

        $invoice->attachMedia($media, 'pdf');
    } finally {
        @unlink($tmp);
    }

    $download = DocumentDownload::create([
        'type' => 'invoice',
        'ids' => [$invoice->id],
    ]);

    try {
        (new DownloadService)->download($download->id, $this->user);

        $media = $download->fresh()->firstMedia('file');
        $zipContent = Storage::disk('s3_private')->get($media->getDiskPath());
        $zipFile = tempnam(sys_get_temp_dir(), 'zip-check-').'.zip';
        file_put_contents($zipFile, $zipContent);

        try {
            $archive = new ZipArchive;
            $archive->open($zipFile);
            expect($archive->locateName($invoice->issued_on->format('Ymd-').$invoice->document_number.'.pdf'))
                ->not->toBe(false);
            $archive->close();
        } finally {
            @unlink($zipFile);
        }

        Mail::assertSent(DownloadEmail::class);
    } finally {
        app()->useStoragePath($originalStoragePath);
        app('files')->deleteDirectory($storageDir);
    }
});
