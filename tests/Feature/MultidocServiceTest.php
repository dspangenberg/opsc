<?php

use App\Facades\SearchablePdfService;
use App\Jobs\DocumentUploadJob;
use App\Services\MultidocService;
use Illuminate\Process\FakeProcessResult;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Queue;

it('extracts the date from the searchable pdf and dispatches the upload job', function () {
    Queue::fake();

    Process::fake([
        'pdfseparate*' => function ($process) {
            preg_match_all("/'([^']+)'/", $process->command, $matches);

            if (isset($matches[1][1])) {
                file_put_contents(str_replace('%03d', '001', $matches[1][1]), 'dummy');
            }

            return new FakeProcessResult;
        },
        'gs*' => function ($process) {
            preg_match('/-sOutputFile=\'([^\']+)\'/', $process->command, $matches);

            if (isset($matches[1])) {
                file_put_contents(str_replace('%03d', '001', $matches[1]), 'dummy');
            }

            return new FakeProcessResult;
        },
        'zbarimg*' => fn () => new FakeProcessResult,
        'pdfunite*' => fn () => new FakeProcessResult,
    ]);

    $originalStoragePath = storage_path();
    $storageDir = sys_get_temp_dir().'/multidoc_test_'.uniqid();
    app()->useStoragePath($storageDir);

    try {
        $sourceFile = tempnam(sys_get_temp_dir(), 'multidoc_').'.pdf';
        file_put_contents($sourceFile, 'dummy pdf content');

        SearchablePdfService::shouldReceive('create')
            ->once()
            ->andReturn([
                'pdf_path' => $sourceFile,
                'fulltext' => 'Rechnung vom 4. August 2022',
            ]);

        (new MultidocService)->process($sourceFile, 'mehrteilig.pdf');

        Queue::assertPushed(DocumentUploadJob::class, function (DocumentUploadJob $job) {
            return str_starts_with($job->fileName, '2022-08-04_');
        });

        unlink($sourceFile);
    } finally {
        app()->useStoragePath($originalStoragePath);
        app('files')->deleteDirectory($storageDir);
    }
});

it('uses a unique temp file path for each run to avoid overwriting output files', function () {
    Queue::fake();

    Process::fake([
        'pdfseparate*' => function ($process) {
            preg_match_all("/'([^']+)'/", $process->command, $matches);

            if (isset($matches[1][1])) {
                file_put_contents(str_replace('%03d', '001', $matches[1][1]), 'dummy');
            }

            return new FakeProcessResult;
        },
        'gs*' => function ($process) {
            preg_match('/-sOutputFile=\'([^\']+)\'/', $process->command, $matches);

            if (isset($matches[1])) {
                file_put_contents(str_replace('%03d', '001', $matches[1]), 'dummy');
            }

            return new FakeProcessResult;
        },
        'zbarimg*' => fn () => new FakeProcessResult,
        'pdfunite*' => fn () => new FakeProcessResult,
    ]);

    $originalStoragePath = storage_path();
    $storageDir = sys_get_temp_dir().'/multidoc_test_'.uniqid();
    app()->useStoragePath($storageDir);

    try {
        $sourceFile = tempnam(sys_get_temp_dir(), 'multidoc_').'.pdf';
        file_put_contents($sourceFile, 'dummy pdf content');

        SearchablePdfService::shouldReceive('create')
            ->twice()
            ->andReturn([
                'pdf_path' => $sourceFile,
                'fulltext' => 'Rechnung vom 4. August 2022',
            ]);

        (new MultidocService)->process($sourceFile, 'mehrteilig.pdf');
        (new MultidocService)->process($sourceFile, 'mehrteilig.pdf');

        $jobs = Queue::pushed(DocumentUploadJob::class);

        expect($jobs)->toHaveCount(2);
        expect($jobs[0]->file)->not->toBe($jobs[1]->file);
        expect(file_exists($jobs[0]->file))->toBeTrue();
        expect(file_exists($jobs[1]->file))->toBeTrue();
        expect($jobs[0]->fileName)->toBe('2022-08-04_group_0.pdf');

        unlink($sourceFile);
    } finally {
        app()->useStoragePath($originalStoragePath);
        app('files')->deleteDirectory($storageDir);
    }
});
