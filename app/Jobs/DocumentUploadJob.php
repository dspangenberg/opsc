<?php

namespace App\Jobs;

use App\Services\DocumentUploadService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Exception;

class DocumentUploadJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public string $file,
        public string $fileName,
        public int $fileSize,
        public string $fileMimeType,
        public int $fileMTime,
        public ?string $label = null
    ) {}

    /**
     * Execute the job.
     *
     * @throws Exception
     */
    public function handle(DocumentUploadService $service): void
    {
        $service->upload($this->file, $this->fileName, $this->fileSize, $this->fileMimeType, $this->fileMTime, $this->label);
    }
}
