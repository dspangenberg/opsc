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
