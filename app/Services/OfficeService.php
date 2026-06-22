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

        $templateId = Arr::get($data, 'template_id');
        if (! $templateId) {
            throw new InvalidArgumentException('Keine Vorlage ausgewählt.');
        }

        $userId = Arr::get($data, 'user_id');
        if (! $userId) {
            throw new InvalidArgumentException('Keinen Ansprechpartner ausgewählt.');
        }

        $user = User::with(['contact.phones', 'contact.mails', 'contact.company.phones'])->find($userId);

        $contact = Contact::find($data['recipient_id']);

        $recipientContact = null;
        if ($data['recipient_contact_id']) {
            $recipientContact = Contact::find($data['recipient_contact_id']);
        }

        $address = $contact->getInvoiceAddress($contact->id);
        $addressLines = $address->full_address;

        if ($recipientContact) {
            $addressLines = Arr::prepend($addressLines, $recipientContact->full_name);
        }

        $addressLines = Arr::prepend($addressLines, $contact->name);

        $template = OfficeTemplate::find($templateId);

        $signatureLeft = [];
        $signatureRight = [];

        $signatureLeftUser = User::with('contact')->find($data['signature_left_user_id']);
        if ($signatureLeftUser) {
            $signatureLeft[] = $signatureLeftUser->contact->full_name;
            if ($signatureLeftUser->contact->position || $signatureLeftUser->contact->department) {
                $signatureLeft[] = $signatureLeftUser->contact->position ? $signatureLeftUser->contact->position : $signatureLeftUser->contact->department;
            }
        }

        if ($data['signature_right_user_id']) {
            $signatureRightUser = User::with('contact')->find($data['signature_right_user_id']);
            if ($signatureRightUser) {
                $signatureRight[] = $signatureRightUser->contact->full_name;
                if ($signatureRightUser->contact->position || $signatureRightUser->contact->department) {
                    $signatureRight[] = $signatureRightUser->contact->position ? $signatureRightUser->contact->position : $signatureRightUser->contact->department;
                }
            }
        }


        /*
        $signature_right = User::with('contact')->find($data['signature_right_id']);
        if ($signature_right) {
            $addressLines[] = $signature_right->contact->full_name;
        }
        */

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
        $docData['letter_signature_left'] = Arr::join($signatureLeft, "\n");
        $docData['letter_signature_right'] = Arr::join($signatureRight, "\n");

        ray($docData);

        $templateProcessor->setValues($docData);

        return $templateProcessor->save();
    }
}
