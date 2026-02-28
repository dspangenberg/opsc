<?php

namespace App\Console\Commands;

use App\Mail\InvoiceReminderEmail;
use App\Models\Invoice;
use App\Models\InvoiceReminder;
use App\Models\Tenant;
use App\Settings\InvoiceReminderSettings;
use Exception;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\Mail;

class CreateFirstReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:create-first-reminder {--tenant= : Optional tenant ID to process only one tenant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create first reminder for invoices that are overdue';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $tenantId = $this->option('tenant');

        if ($tenantId) {
            $tenant = Tenant::find($tenantId);
            if (!$tenant) {
                $this->error("Tenant $tenantId not found");

                return self::FAILURE;
            }
            $this->processTenant($tenant);
        } else {
            $tenants = Tenant::all();
            $this->info('Processing '.count($tenants).' tenants...');

            foreach ($tenants as $tenant) {
                $this->processTenant($tenant);
            }
        }

        return self::SUCCESS;
    }

    private function processTenant(Tenant $tenant): bool
    {
        $result = $tenant->run(function () use ($tenant) {
            $invoiceReminderSettings = app(InvoiceReminderSettings::class);

            if ($invoiceReminderSettings->level_1_days === 0) {
                $this->info('Zahlungserinnerungen sind deaktiviert.');
                return false;
            }

            $mailFrom = Config::get('mail.from.address');

            $this->info("Processing tenant: $tenant->id");

            $invoices = Invoice::query()
                ->where('is_draft', false)
                ->where('dunning_block', false)
                ->whereYear('issued_on', '>', 2025)
                ->withSum('lines', 'amount')
                ->withSum('lines', 'tax')
                ->withSum('payable', 'amount')
                ->with('contact')
                ->doesntHave('reminders')
                ->unpaid()
                ->get();

            if ($invoices->isEmpty()) {
                $this->info('Keine offenen Rechnungen gefunden.');
                return false;
            }

            foreach ($invoices as $invoice) {
                try {
                    if ($invoice->dunning_days > $invoiceReminderSettings->level_1_days) {
                        $this->info(" Rechnung $invoice->formated_invoice_number ist überfällig");

                        $reminder = InvoiceReminder::create([
                            'invoice_id' => $invoice->id,
                            'dunning_level' => 1,
                            'dunning_days' => $invoice->dunning_days,
                            'open_amount' => $invoice->amount_open,
                            'issued_on' => now(),
                            'due_on' => now()->addDays($invoiceReminderSettings->level_1_due_days),
                            'next_level_on' => now()->addDays($invoiceReminderSettings->level_1_next_level_days),
                        ]);

                        $invoice->addHistory($reminder->type.' wurde versendet.', 'reminder');

                        $reminder->invoice
                            ->loadSum('lines', 'amount')
                            ->loadSum('lines', 'tax');

                        $primaryMail = $reminder->invoice->contact?->primary_mail;
                        if (!$primaryMail) {
                            $this->warn("Kein E-Mail-Empfänger für Rechnung {$invoice->formated_invoice_number}");
                            continue;
                        }
                        Mail::to($primaryMail)
                            ->cc($mailFrom)
                            ->queue(new InvoiceReminderEmail($reminder));
                    }
                } catch (Exception $e) {
                    $this->error("Zahlungserinnerung für $invoice->id konnte nicht erstellt werden: {$e->getMessage()}");
                }
            }

            return true;
        });

        return (bool) $result;
    }
}
