<?php

namespace App\Console\Commands;

use App\Models\DocumentDownload;
use App\Models\Tenant;
use Illuminate\Console\Command;

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
    public function handle(): bool
    {
        $tenantId = $this->option('tenant');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);
            if (! $tenant) {
                $this->error("Tenant $tenantId not found");

                return false;
            }
            $this->processTenant($tenant);
        } else {
            $tenants = Tenant::all();
            $this->info('Processing '.count($tenants).' tenants...');

            foreach ($tenants as $tenant) {
                $this->processTenant($tenant);
            }
        }

        return true;
    }

    private function processTenant(Tenant $tenant): bool
    {
        $result = $tenant->run(function () {
            $files = DocumentDownload::get();

            $files->each(function ($file) {
                $hours = $file->created_at->diffInHours(now());
                if ($hours > 1) {
                    if ($file->hasMedia('file')) {
                        $file->firstMedia('file')->delete();
                    }
                    $file->delete();
                }
            });

            return true;
        });

        return $result;
    }
}
