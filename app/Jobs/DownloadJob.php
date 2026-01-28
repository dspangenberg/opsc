<?php

namespace App\Jobs;

use App\Services\DownloadService;
use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Exception;

class DownloadJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public int $id,
        public User $user
    ) {}

    /**
     * Execute the job.
     *
     * @throws Exception
     */
    public function handle(DownloadService $service): void
    {
        $service->download($this->id, $this->user);
    }
}
