<?php

use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Tests\TestCase;

uses(TestCase::class);

test('inlineFile response macro sets the inline filename header', function () {
    $path = tempnam(sys_get_temp_dir(), 'pdf');
    file_put_contents($path, 'test');

    $response = response()->inlineFile($path, 'report.pdf');

    expect($response)->toBeInstanceOf(BinaryFileResponse::class)
        ->and($response->headers->get('Content-Disposition'))
        ->toBe('inline; filename=report.pdf');

    unlink($path);
});
