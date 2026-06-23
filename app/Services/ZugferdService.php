<?php

namespace App\Services;

use App\Enums\ZugferdProfileEnum;
use App\Facades\FileHelperService;
use App\Models\BankAccount;
use App\Models\Contact;
use App\Models\Invoice;
use App\Settings\ZugferdSettings;
use horstoeko\zugferd\codelists\ZugferdCurrencyCodes;
use horstoeko\zugferd\codelists\ZugferdElectronicAddressScheme;
use horstoeko\zugferd\codelists\ZugferdVatCategoryCodes;
use horstoeko\zugferd\codelists\ZugferdVatTypeCodes;
use horstoeko\zugferd\ZugferdDocumentBuilder;
use horstoeko\zugferdlaravel\Facades\ZugferdLaravel;
use Illuminate\Support\Collection;

class ZugferdService
{
    public ZugferdDocumentBuilder $xmlDoc;

    public Invoice $invoice;

    public array $taxes;

    public BankAccount $bankAccount;

    public ZugferdSettings $settings;

    public string $pdfFileName;

    public function __construct() {}

    public function setSellerData(): void
    {
        $contact = Contact::find($this->settings->seller_contact_id);
        $this->xmlDoc
            ->addDocumentNote($this->settings->document_note, '', 'REG')
            ->setDocumentSeller($this->settings->seller)
            ->setDocumentSellerCommunication(ZugferdElectronicAddressScheme::UNECE3155_EM,
                $this->settings->seller_email)
            ->addDocumentSellerGlobalId($this->settings->global_id, $this->settings->global_id_type)
            ->addDocumentSellerTaxRegistration('VA', $this->settings->seller_tax_vat)
            ->setDocumentSellerAddress(
                $this->settings->seller_address_line_1,
                $this->settings->seller_address_line_2,
                $this->settings->seller_address_line_3,
                $this->settings->seller_zip,
                $this->settings->seller_city,
                $this->settings->seller_country_iso
            )
            ->setDocumentSellerContact($contact->full_name, $contact->department, $contact->primary_phone, '',
                $contact->primary_mail);
    }

    public function getBuyerReference(): string
    {
        if ($this->invoice->zugferd_route_id) {
            return $this->invoice->zugferd_route_id;
        }

        if ($this->invoice->contact->vat_id) {
            return $this->invoice->contact->vat_id;
        }

        return $this->invoice->contact->formated_debtor_number;
    }

    public function getInvoiceLines(): Collection
    {
        return $this->invoice->lines->filter(function ($line) {
            return $line->type_id !== 9;
        });
    }

    public function getLinkedInvoices(): Collection
    {
        return $this->invoice->linked_invoices ?? collect();
    }

    public function getPrepaidAmount(): float
    {
        $prepaidAmount = 0;
        foreach ($this->getLinkedInvoices() as $invoice) {
            $prepaidAmount += round($invoice->amount + $invoice->tax, 2);
        }

        return round(abs($prepaidAmount), 2);
    }

    public function getPrepaidInvoices(): void
    {
        if ($this->getLinkedInvoices()->isNotEmpty()) {
            foreach ($this->getLinkedInvoices() as $invoice) {
                $this->xmlDoc->addDocumentInvoiceReferencedDocument(
                    $invoice->linked_invoice->formated_invoice_number,
                    null,
                    $invoice->linked_invoice->issued_on,
                );
            }
        }
    }

    public function setDocumentPositions(): void
    {
        foreach ($this->getInvoiceLines() as $index => $line) {
            $this->xmlDoc->addNewPosition((string) ($index + 1));
            $positionText = trim(strip_md($line->text));
            $this->xmlDoc->setDocumentPositionProductDetails(
                $positionText !== '' ? $positionText : 'Position',
            );
            if ($line->service_period_begin && $line->service_period_end) {
                $this->xmlDoc->setDocumentPositionBillingPeriod($line->service_period_begin, $line->service_period_end);
            }

            $unitCode = ($line->unit === 'h') ? 'HUR' : 'C63';

            $this->xmlDoc->setDocumentPositionNetPrice(round($line->price, 2));
            $this->xmlDoc->setDocumentPositionQuantity(round($line->quantity, 2), $unitCode);
            $this->xmlDoc->addDocumentPositionTax(
                'S',
                'VAT',
                $line->rate?->rate ?? 0
            );
            $this->xmlDoc->setDocumentPositionLineSummation(round($line->amount, 2));
        }
    }

    public function setBuyerData(): void
    {

        $addressLines = explode("\n", $this->invoice->contact->getInvoiceAddress()->address);

        $this->xmlDoc
            ->setDocumentBuyer($this->invoice->contact->name ?? $this->invoice->contact?->full_name ?? '',
                $this->invoice->contact->formated_debtor_number)
            ->setDocumentBuyerReference($this->getBuyerReference())
            ->addDocumentBuyerVATRegistrationNumber($this->invoice->contact->vat_id)
            ->setDocumentBuyerCommunication(ZugferdElectronicAddressScheme::UNECE3155_EM,
                $this->invoice->contact->primary_mail)
            ->setDocumentBuyerAddress(
                $addressLines[0],
                $addressLines[1] ?? '',
                $addressLines[2] ?? '',
                $this->invoice->contact->getInvoiceAddress()->zip,
                $this->invoice->contact->getInvoiceAddress()->city,
                $this->invoice->contact->getInvoiceAddress()->country->iso_code
            );

        if ($this->invoice->invoice_contact_id) {
            $contact = Contact::with(['mails', 'phones'])->find($this->invoice->invoice_contact_id);
            if ($contact) {
                $this->xmlDoc->setDocumentBuyerContact(
                    $contact->full_name,
                    $contact->department,
                    $contact->primary_phone,
                    '',
                    $contact->primary_mail
                );
            }
        }
    }

    public function getTaxBreakdown(): void
    {
        foreach ($this->taxes as $taxData) {
            $this->xmlDoc->addDocumentTax(
                ZugferdVatCategoryCodes::STAN_RATE,
                ZugferdVatTypeCodes::VALUE_ADDED_TAX,
                $taxData['amount'],
                $taxData['sum'],
                $taxData['tax_rate']['rate']);
        }
    }

    public function getPaymentInformation(): void
    {
        if ($this->invoice->type->zugferd_id === '384' && $this->invoice->parent_invoice) {
            $this->xmlDoc
                ->addDocumentPaymentMean('97',
                    'Der Gutschriftbetrag wird mit der Rechnung '.$this->invoice->parent_invoice->formated_invoice_number.' verrechnet.');
        } else {
            $this->xmlDoc
                ->addDocumentPaymentMeanToCreditTransfer(
                    $this->bankAccount->iban,
                    $this->bankAccount->account_owner,
                    null,
                    $this->bankAccount->bic,
                    $this->invoice->purpose
                )
                ->addDocumentPaymentTerm($this->settings->payment_term, $this->invoice->due_on);
        }
    }

    public function getSummation(): void
    {

        $lineTotal = round($this->getInvoiceLines()->sum(fn ($l) => round($l->amount, 2)), 2);
        $taxTotal = round(collect($this->taxes)->sum(fn ($t) => round($t['sum'], 2)), 2);

        $this->xmlDoc->setDocumentSummation(
            round($lineTotal + $taxTotal, 2),
            round(($lineTotal + $taxTotal) - $this->getPrepaidAmount(), 2),
            $lineTotal,
            0,
            0,
            $lineTotal,
            $taxTotal,
            0,
            $this->getPrepaidAmount()
        );
    }

    public function generateZugferdXml(
        string $orgPdfFile,
        Invoice $invoice,
        array $taxes,
        BankAccount $bankAccount
    ): string {
        /*
        * Wir haben im XML eine Warnung, die wir aber ignorieren können, solange kein B2G
        *  Das Element "Specification identifier" (BT-24) soll syntaktisch der Kennung des Standards XRechnung entsprechen.
        *  [ID BR-DE-21] from /xslt/XR_30/XRechnung-CII-validation.xslt)
        *
        * [PEPPOL-EN16931-R008]-Document MUST not contain empty elements. (still status warning) from /xslt/ZF_250/FACTUR-X_EN16931.xslt)
        * ist nur eine Warnung und es gibt noch keine Lösung und kann erst einmal ignoriert werden.
        *
        * TODO:
        * - Markdown aus Rechnungspostionen entfernen
        */

        $this->invoice = $invoice;
        $this->taxes = $taxes;
        $this->bankAccount = $bankAccount;
        $this->settings = app(ZugferdSettings::class);

        $this->pdfFileName = FileHelperService::getTempFile('pdf');

        $this->xmlDoc = $invoice->zugferd_profile === ZugferdProfileEnum::ZUGFERD
            ? ZugferdLaravel::createDocumentInEN16931Profile()
            : ZugferdLaravel::createDocumentInXRechnung30Profile();

        /*
        if ($invoice->zugferd_profile === ZugferdProfileEnum::ZUGFERD) {
            $this->xmlDoc->setDocumentBusinessProcess('urn:fdc:peppol.eu:2017:poacc:billing:01:1.0');
        }
        */

        $this->xmlDoc
            ->setDocumentInformation(
                $invoice->formated_invoice_number,
                $invoice->type->zugferd_id,
                $invoice->issued_on,
                ZugferdCurrencyCodes::EURO,
                $invoice->type->print_name
            );

        if ($this->invoice->service_period_begin && $this->invoice->service_period_end) {
            $this->xmlDoc->setDocumentBillingPeriod($this->invoice->service_period_begin,
                $this->invoice->service_period_end, '');
        }

        if ($this->invoice->additional_text) {
            $this->xmlDoc->addDocumentNote($this->invoice->additional_text, '', 'AFB');
        }

        if ($this->invoice->type->zugferd_id === '384' && $this->invoice->parent_invoice) {
            $this->xmlDoc->addDocumentInvoiceReferencedDocument(
                $invoice->parent_invoice->formated_invoice_number,
                null,
                $invoice->parent_invoice->issued_on,
            );
        }

        $this->setSellerData();
        $this->setBuyerData();
        $this->setDocumentPositions();
        $this->getTaxBreakdown();
        $this->getSummation();
        $this->getPaymentInformation();
        $this->getPrepaidInvoices();

        /*
        if ($this->invoice->project_id) {
            $this->xmlDoc->setDocumentProcuringProject($this->invoice->project->name, $this->invoice->project->id);
        }
        */

        ZugferdLaravel::buildMergedPdfByDocumentBuilder($this->xmlDoc, $orgPdfFile, $this->pdfFileName);

        return $this->pdfFileName;

    }
}
