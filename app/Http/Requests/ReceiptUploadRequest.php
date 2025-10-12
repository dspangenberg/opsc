<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\ValidationRule;

class ReceiptUploadRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'files' => 'required|array|min:1|max:10', // Maximal 10 Dateien
            'files.*' => 'required|file|mimes:pdf,txt,zip|max:51200', // Jede Datei validieren
        ];
    }

    public function messages(): array
    {
        return [
            'files.required' => 'Bitte wählen Sie mindestens eine Datei aus.',
            'files.array' => 'Ungültiger Dateientyp.',
            'files.min' => 'Bitte wählen Sie mindestens eine Datei aus.',
            'files.max' => 'Sie können maximal 10 Dateien gleichzeitig hochladen.',
            'files.*.required' => 'Jede Datei ist erforderlich.',
            'files.*.file' => 'Jede Auswahl muss eine Datei sein.',
            'files.*.mimes' => 'Jede Datei muss vom Typ PDF oder TXT sein.',
            'files.*.max' => 'Jede Datei darf maximal 50MB groß sein.',
        ];
    }
}
