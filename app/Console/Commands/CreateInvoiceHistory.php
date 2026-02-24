<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use App\Models\Tenant;
use App\Models\User;
use App\Settings\InvoiceReminderSettings;
use Exception;
use Illuminate\Console\Command;

class CreateInvoiceHistory extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:create-history {--tenant= : Optional tenant ID to process only one tenant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Erstellt nachträglich History für Rechnungen';

    /**
     * Execute the console command.
     */
    public function handle(): bool
    {
        $tenantId = $this->option('tenant');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);
            if (!$tenant) {
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
        $result = $tenant->run(function () use ($tenant) {
            $invoiceReminderSettings = app(InvoiceReminderSettings::class);

            if ($invoiceReminderSettings->level_1_days === 0) {
                $this->info('Zahlungserinnerungen sind deaktiviert.');
                return false;
            }


            $this->info("Processing tenant: $tenant->id");

            $invoices = Invoice::query()
                ->whereYear('issued_on', '>', 2024)
                ->with('payable')
                ->doesntHave('notables')
                ->get();

            if ($invoices->isEmpty()) {
                $this->info('Keine offenen Rechnungen gefunden.');
                return false;
            }

            $defaultUser = User::first();

            foreach ($invoices as $invoice) {
                try {

                    $invoice->addHistory('hat die Rechnung erstellt.', 'created', $defaultUser, $invoice->created_at);
                    if ($invoice->sent_at) {
                        $invoice->addHistory('hat die Rechnung versendet.', 'mail_sent', $defaultUser, $invoice->sent_at);
                    }

                    foreach ($invoice->payable as $payable) {
                        $invoice->addHistory('Zahlungseingang vom '.$payable->issued_on->format('d.m.Y').' über '.number_format($payable->amount, 2, ',', '.').' EUR wurde verrechnet.', 'paid', null, $payable->created_at);
                    }

                } catch (Exception $e) {
                    $this->error("Zahlungserinnerung für $invoice->id konnte nicht erstellt werden: {$e->getMessage()}");
                }
            }

            return true;
        });

        return $result;
    }
}
