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
     * The number of seconds the job can run before timing out.
     *
     * @var int
     */
    public $timeout = 300;

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
        // Increase memory limit for large PDFs
        $originalLimit = ini_get('memory_limit');
        ini_set('memory_limit', '512M');

        try {
            $service->upload($this->file, $this->fileName, $this->fileSize, $this->fileMimeType, $this->fileMTime, $this->label);
        } finally {
            // Restore original memory limit
            ini_set('memory_limit', $originalLimit);
        }
    }
}
