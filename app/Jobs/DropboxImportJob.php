<?php

namespace App\Jobs;

use App\Models\DropboxInbox;
use App\Services\DropboxService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

class DropboxImportJob implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public DropboxInbox $mail,
    ) {}

    /**
     * Execute the job.
     *
     * @throws Throwable
     */
    public function handle(DropboxService $service): void
    {
        $service->importMail($this->mail);
    }
}
