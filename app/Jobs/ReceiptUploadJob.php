<?php

namespace App\Jobs;

use App\Services\ReceiptService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Http\UploadedFile;
use Exception;

class ReceiptUploadJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $file
    ) {}

    /**
     * Execute the job.
     *
     * @throws Exception
     */
    public function handle(ReceiptService $service): void
    {
        $service->processZipArchive($this->file);
    }
}
