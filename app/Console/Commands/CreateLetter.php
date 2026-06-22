<?php

namespace App\Console\Commands;

use App\Facades\FileHelperService;
use App\Models\Contact;
use App\Models\OfficeTemplate;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use PhpOffice\PhpWord\TemplateProcessor;

class CreateLetter extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'letter:create {--tenant= : Optional tenant ID to process only one tenant}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Erstellt ein WordDokumentg';

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
        } else {
            $tenant = Tenant::first();
        }
        $this->processTenant($tenant);

        return true;
    }

    private function processTenant(Tenant $tenant): bool
    {
        $result = $tenant->run(function () use ($tenant) {

            $template = OfficeTemplate::first();
            $media = $template->firstMedia('file');

            $docx = FileHelperService::createTemporaryFileFromDoc('template', $media->contents(), '.docx');


            $tmpDir = FileHelperService::getTempFile('docx');
            $this->info("Processing tenant: $tenant->id");

            // $docxFile = storage_path('system/word-templates/Normal.docx');
            $templateProcessor = new TemplateProcessor($docx);

            ray($templateProcessor->getVariables());

            $this->info($docx);

            $contact = Contact::with(['company', 'addresses'])->find(220);

            $address = $contact->company->getInvoiceAddress($contact->id);
            $letter_salutation = $contact->is_org ? 'Guten Tag' : 'Guten Tag, '.$contact->full_name;

            $addressLines = $address->full_address
                    |> (fn($x) => Arr::prepend($x, $contact->full_name))
                    |> (fn($x) => Arr::prepend($x, $contact->company->name));

            $data = [
                'letter_date' => now()->format('d.m.Y'),
                'letter_signature_left' => "Danny Spangenberg\nInhaber",
                'letter_signature_right' => '',
                'reciepent_city' => $address->city,
                'reciepient_full_address' => Arr::join($addressLines, "\n"),
                'letter_salutation' => $letter_salutation,
                'letter_subject' => "Ihr Webhostingvertrag\nÜbersendung Auth-Info-Code",
                'contact' => 'Danny Spangenberg',
                'contact_email' => 'danny.spangenberg@twiceware.de',
                'contact_phone' => '+49 228 84 26 37 64',
                'contact_mobile' => '+49 176 20 97 12 51',
                'letter_shipment' => '', // "nur per Telefax +49 228 96397041\n",
            ];

            $templateProcessor->setValues($data);
            $templateProcessor->deleteBlock('block_name');
            $templateProcessor->setCheckbox('checkbox3', true);

            $templateProcessor->saveAs($tmpDir);
            $this->info($tmpDir);

        });

        return true;
    }
}
