<?php

namespace App\Jobs;

use App\Services\ReceiptService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Plank\Mediable\Media;

class ReceiptUploadFromMailAttchmentJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Media $media,
    ) {}

    /**
     * Execute the job.
     *
     * @throws Exception
     */
    public function handle(ReceiptService $service): void
    {
        $service->processMailAttachment($this->media);
    }
}
