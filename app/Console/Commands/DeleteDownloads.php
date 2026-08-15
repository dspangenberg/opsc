<?php

namespace App\Console\Commands;

use App\Models\DocumentDownload;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Throwable;

class DeleteDownloads extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'downloads:delete {--tenant= : Optional tenant ID to process only one tenant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Löscht alte Downloads';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tenantId = $this->option('tenant');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);
            if (! $tenant) {
                $this->error("Tenant $tenantId not found");

                return static::FAILURE;
            }
            $this->processTenant($tenant);
        } else {
            $tenants = Tenant::all();
            $this->info('Processing '.count($tenants).' tenants...');

            foreach ($tenants as $tenant) {
                $this->processTenant($tenant);
            }
        }

        return static::SUCCESS;
    }

    private function processTenant(Tenant $tenant): void
    {
        $tenant->run(function () {
            DocumentDownload::query()
                ->where('created_at', '<', now()->subHour())
                ->chunkById(100, function ($downloads) {
                    foreach ($downloads as $download) {
                        try {
                            $download->getMedia('file')->each->delete();
                            $download->delete();
                        } catch (Throwable $e) {
                            report($e);
                        }
                    }
                });
        });
    }
}
