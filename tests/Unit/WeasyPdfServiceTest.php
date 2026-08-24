<?php

use App\Services\WeasyPdfService;
use Illuminate\Support\Facades\Process;

function runPdfCpuMethod(string $method, array $args): string
{
    $service = new WeasyPdfService;
    $reflection = new ReflectionMethod($service, $method);
    $reflection->setAccessible(true);

    return $reflection->invokeArgs($service, $args);
}

test('pdfcpu subprocesses run with XDG_CONFIG_HOME pointing to the pdfcpu config dir', function () {
    config()->set('pdf.pdfcpu_path', '/usr/bin/pdfcpu');

    Process::fake();

    runPdfCpuMethod('addLetterhead', ['/tmp/input.pdf', '/tmp/letterhead.pdf']);
    runPdfCpuMethod('addStamp', ['/tmp/input.pdf', 'ENTWURF']);
    runPdfCpuMethod('mergePdfs', [['/tmp/a.pdf', '/tmp/b.pdf']]);

    $configDir = config('pdf.pdfcpu_config_dir');

    Process::assertRan(function ($process) use ($configDir) {
        return str_contains($process->command, 'watermark add')
            && ($process->environment['XDG_CONFIG_HOME'] ?? null) === $configDir;
    });

    Process::assertRan(function ($process) use ($configDir) {
        return str_contains($process->command, 'stamp add')
            && ($process->environment['XDG_CONFIG_HOME'] ?? null) === $configDir;
    });

    Process::assertRan(function ($process) use ($configDir) {
        return str_contains($process->command, ' merge ')
            && ($process->environment['XDG_CONFIG_HOME'] ?? null) === $configDir;
    });
});

test('pdfcpu output files are written into an existing directory', function () {
    config()->set('pdf.pdfcpu_path', '/usr/bin/pdfcpu');

    Process::fake();

    $output = runPdfCpuMethod('addStamp', ['/tmp/input.pdf', 'ENTWURF']);

    expect(is_dir(dirname($output)))->toBeTrue()
        ->and(is_writable(dirname($output)))->toBeTrue();
});
