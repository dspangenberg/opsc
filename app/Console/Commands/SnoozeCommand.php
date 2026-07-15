<?php

namespace App\Console\Commands;

use App\Events\GeneralNotificationEvent;
use App\Models\DropboxMail;
use App\Models\Tenant;
use Illuminate\Console\Command;

class SnoozeCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'dropbox:snooze {--tenant= : Optional tenant ID to process only one tenant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Snoozed E-Mail zurücklegen';

    /**
     * Execute the console command.
     */
    public function handle(): int
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
            $mails = DropboxMail::query()->with('dropbox.user')->where('snoozed_until', '<=', now())->get();

            foreach ($mails as $mail) {
                $mail->snoozed_until = null;
                $mail->seen_at = null;
                $mail->save();

                if ($mail->dropbox->user) {
                    GeneralNotificationEvent::dispatch($mail->dropbox->user, 'Unsnoozed E-Mail');
                }
            }
        });
    }
}
