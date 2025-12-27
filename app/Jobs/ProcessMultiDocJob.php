<?php

namespace App\Jobs;

use App\Services\MultidocService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Exception;

class ProcessMultiDocJob implements ShouldQueue
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
    public function handle(MultidocService $service): void
    {
        $service->process($this->file);
    }
}
