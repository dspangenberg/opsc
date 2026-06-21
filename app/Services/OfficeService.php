<?php

namespace App\Services;

use App\Facades\FileHelperService;
use App\Models\Contact;
use App\Models\OfficeTemplate;
use App\Models\User;
use Illuminate\Support\Arr;
use InvalidArgumentException;
use PhpOffice\PhpWord\Exception\CopyFileException;
use PhpOffice\PhpWord\Exception\CreateTemporaryFileException;
use PhpOffice\PhpWord\Exception\Exception;
use PhpOffice\PhpWord\TemplateProcessor;

class OfficeService
{
    /**
     * @throws CopyFileException
     * @throws Exception
     * @throws CreateTemporaryFileException
     */
    public function createOfficeLetter(array $data): string
    {

        ray($data);

        $templateId = Arr::get($data, 'template_id');
        if (! $templateId) {
            throw new InvalidArgumentException('Keine Vorlage ausgewählt.');
        }

        $userId = Arr::get($data, 'user_id');
        if (! $userId) {
            throw new InvalidArgumentException('Keinen Ansprechpartner ausgewählt.');
        }

        $user = User::with(['contact.phones', 'contact.mails', 'contact.company.phones'])->find($userId);
        ray($user->toArray());

        $contact = Contact::find($data['recipient_id']);

        $recipientContact = null;
        if ($data['recipient_contact_id']) {
            $recipientContact = Contact::find($data['recipient_contact_id']);
        }

        $address = $contact->getInvoiceAddress($contact->id);
        $addressLines = $address->full_address;

        if ($recipientContact) {
            ray($recipientContact->toArray());
            $addressLines = Arr::prepend($addressLines, $recipientContact->full_name);
        }

        $addressLines = Arr::prepend($addressLines, $contact->name);
        
        $template = OfficeTemplate::find($templateId);
        $media = $template->firstMedia('file');

        $docx = FileHelperService::createTemporaryFileFromDoc('template', $media->contents(), '.docx');
        $templateProcessor = new TemplateProcessor($docx);

        $docData = [];
        $vars = $templateProcessor->getVariables();
        foreach ($vars as $var) {
            $docData[$var] = '';
        }

        $docData['letter_date'] = $data['date'];
        $docData['letter_salutation'] = $data['salutation'];
        $docData['contact'] = $user->contact->full_name;
        $docData['contact_phone'] = $user->contact->primary_phone !== '' ? $user->contact->primary_phone : $user->contact->company->primary_phone;
        $docData['contact_email'] = $user->contact->primary_mail;
        $docData['letter_subject'] = $data['subject'];
        $docData['reciepent_city'] = $address->city;
        $docData['reciepient_full_address'] = Arr::join($addressLines, "\n");

        ray($docData);
        $templateProcessor->setValues($docData);

        return $templateProcessor->save();
    }
}
