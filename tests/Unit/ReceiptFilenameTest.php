<?php

use App\Models\Receipt;

test('it returns the original filename when no media is attached', function () {
    $receipt = new class extends Receipt
    {
        public function firstMedia($tags = null, bool $matchAll = false)
        {
            return null;
        }
    };

    $receipt->org_filename = 'fallback.pdf';

    expect($receipt->getOriginalFilename())->toBe('fallback.pdf');
});

test('it prefers the media filename when present', function () {
    $receipt = new class extends Receipt
    {
        public function firstMedia($tags = null, bool $matchAll = false)
        {
            return (object) ['filename' => 'media.pdf'];
        }
    };

    $receipt->org_filename = 'fallback.pdf';

    expect($receipt->getOriginalFilename())->toBe('media.pdf');
});
