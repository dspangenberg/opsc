<?php

namespace App\Console\Commands;

use App\Models\DropboxMail;
use App\Models\Tenant;
use Illuminate\Console\Command;

class SetInboundForDropboxMails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dropbox:inbound {--tenant= : Optional tenant ID to process only one tenant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create recurring invoices that are due today';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $tenantId = $this->option('tenant');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);
            if (! $tenant) {
                $this->error("Tenant {$tenantId} not found");

                return 1;
            }
            $this->processTenant($tenant);
        } else {
            $tenants = Tenant::all();
            $this->info('Processing '.count($tenants).' tenants...');

            foreach ($tenants as $tenant) {
                $this->processTenant($tenant);
            }
        }

        return 0;
    }

    private function processTenant(Tenant $tenant): void
    {
        $tenant->run(function () {
            $mails = DropboxMail::query()->with('dropbox')->get();

            foreach ($mails as $mail) {
                $mail->is_inbound = $mail->dropbox->real_email !== $mail->from;
                $mail->save();
            }
        });
    }
}
