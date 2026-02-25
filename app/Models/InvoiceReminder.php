<?php

namespace App\Models;

use App\Facades\WeasyPdfService;
use App\Settings\InvoiceReminderSettings;
use Exception;
use Illuminate\Contracts\Mail\Attachable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Mail\Attachment;

class InvoiceReminder extends Model implements Attachable
{
    protected $fillable = [
        'invoice_id',
        'issued_on',
        'due_on',
        'open_amount',
        'dunning_level',
        'dunning_days',
        'next_level_on',
    ];

    protected $appends = [
        'city',
        'email_subject',
        'filename',
        'intro_text',
        'name',
        'outro_text',
        'type',
    ];

    private function getSetting(string $key): string
    {
        if (!in_array($this->dunning_level, [1, 2, 3], true)) {
            return '';
        }

        $invoiceReminderSettings = app(InvoiceReminderSettings::class);

        $key = 'level_'.$this->dunning_level.'_'.$key;
        return $invoiceReminderSettings->$key;
    }

    public function getNameAttribute(): string
    {
        $this->loadMissing('invoice', 'invoice.contact');
        if ($this->invoice->invoice_contact_id) {
            $this->loadMissing('invoice.invoice_contact');

            if ($this->invoice->invoice_contact?->full_name) {
                return $this->invoice->invoice_contact?->full_name;
            }

        } elseif ($this->invoice->project_id) {
            $this->loadMissing('invoice.project');
            if ($this->invoice->project->manager_contact_id) {
                $this->loadMissing('invoice.project.manager');

                if ($this->invoice->project->manager?->full_name) {
                    return $this->invoice->project->manager?->full_name;
                }
            }
        }


        if ($this->invoice->contact?->is_company) {
            return '';
        }


        return $this->invoice->contact?->full_name ?? '';
    }

    public function getCityAttribute(): string
    {
        $this->loadMissing('invoice', 'invoice.contact');
        return $this->invoice->contact->getInvoiceAddress()->city;
    }

    public function getTypeAttribute(): string
    {
        return $this->getSetting('subject');
    }

    public function getIntroTextAttribute(): string
    {
        return $this->getSetting('intro');
    }

    public function getOutroTextAttribute(): string
    {
        return $this->getSetting('outro');
    }

    public function getEmailSubjectAttribute(): string
    {
        return 'RG-'.$this->invoice->formated_invoice_number.' - Zahlungserinnerung';
    }

    public function getFilenameAttribute(): string
    {
        return $this->dunning_level.'-'.str_replace('.', '_', basename($this->invoice->formated_invoice_number)).'.pdf';
    }

    /**
     * @throws Exception
     */
    public function createPdf(string $invoicePath): string
    {
        $this->invoice->loadSum('lines', 'amount');
        $this->invoice->loadSum('lines', 'tax');
        $pdfConfig = [];
        $pdfConfig['hide'] = true;
        return WeasyPdfService::createPdf('invoice', 'pdf.invoice.reminder',
            [
                'reminder' => $this,
            ], $pdfConfig, [$invoicePath]);
    }

    /**
     * @throws Exception
     */
    public function toMailAttachment(): Attachment
    {
        $invoicePath = Invoice::createOrGetPdf($this->invoice, 'DUPLIKAT');
        $file = $this->createPdf($invoicePath);
        return Attachment::fromPath($file)->as($this->filename);
    }

    public function invoice(): BelongsTo
    {
        return $this->belongsTo(Invoice::class);
    }

    protected function casts(): array
    {
        return [
            'issued_on' => 'date',
            'due_on' => 'date',
            'next_level_on' => 'date',
        ];
    }
}
