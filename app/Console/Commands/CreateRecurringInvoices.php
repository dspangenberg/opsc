<?php

namespace App\Console\Commands;

use App\Mail\RecurringInvoiceEmail;
use App\Mail\VerifyEmailAddressForCloudRegistrationMail;
use App\Models\Invoice;
use App\Models\Tenant;
use Config;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;

class CreateRecurringInvoices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:create-recurring {--tenant= : Optional tenant ID to process only one tenant}';

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
        $tenant->run(function () use ($tenant) {
            $this->info("Processing tenant: {$tenant->id}");

            $invoices = Invoice::query()
                ->where('is_recurring', true)
                ->where('is_draft', false)
                ->whereNotNull('recurring_next_billing_date')
                ->whereDate('recurring_next_billing_date', '<=', now())
                ->get();

            if ($invoices->isEmpty()) {
                $this->info('  No recurring invoices due');

                return;
            }

            $this->info("  Found {$invoices->count()} recurring invoice(s) due");

            foreach ($invoices as $invoice) {
                try {
                    $invoice->loadMissing('contact');
                    $newInvoice = Invoice::createRecurringInvoice($invoice);

                    $mailFrom = Config::get('mail.from.address');

                    Mail::to($mailFrom)->send(new RecurringInvoiceEmail($newInvoice));

                    $this->info("  Created invoice {$newInvoice->id} from recurring invoice {$invoice->id}");
                } catch (\Exception $e) {
                    $this->error("  Failed to create recurring invoice from {$invoice->id}: {$e->getMessage()}");
                }
            }
        });
    }
}
