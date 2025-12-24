<?php

namespace App\Http\Controllers\App\Document;

use App\Data\DocumentTypeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentTypeRequest;
use App\Models\DocumentType;
use Inertia\Inertia;

class DocumentTypeController extends Controller
{
    public function index()
    {
        $documentTypes = DocumentType::query()->orderBy('name')->paginate();
        return Inertia::render('App/Document/DocumentType/DocumentTypeIndex', [
            'documentTypes' => DocumentTypeData::collect($documentTypes),
        ]);
    }

    public function create() {
        $documentType = new DocumentType();
        return Inertia::modal('App/Document/DocumentType/DocumentTypeEdit', [
            'documentType' => DocumentTypeData::from($documentType),
        ])->baseRoute('app.documents.document_types.index');
    }

    public function edit(DocumentType $documentType) {
        return Inertia::modal('App/Document/DocumentType/DocumentTypeEdit', [
            'documentType' => DocumentTypeData::from($documentType)
        ])->baseRoute('app.documents.document_types.index');
    }

    public function update(DocumentTypeRequest $request, DocumentType $documentType) {
        $documentType->update($request->validated());
        return redirect()->route('app.documents.document_types.index');
    }

    public function store(DocumentTypeRequest $request) {
        DocumentType::create($request->validated());
        return redirect()->route('app.documents.document_types.index');
    }
}
