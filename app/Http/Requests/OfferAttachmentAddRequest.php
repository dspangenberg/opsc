<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class OfferAttachmentAddRequest extends FormRequest
{
    public function rules(): array
    {
        return [
            'document_ids' => ['required', 'array'],
            'document_ids.*' => ['required', 'numeric', 'exists:documents,id'],
        ];
    }

    public function authorize(): bool
    {
        return true;
    }
}
