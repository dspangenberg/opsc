<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\DocumentTagData;
use App\Data\DocumentTypeData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentTagRequest;
use App\Http\Requests\DocumentTypeRequest;
use App\Models\DocumentTag;
use App\Models\DocumentType;
use Inertia\Inertia;

class DocumentTagController extends Controller
{
    public function index()
    {
        $documentTags = DocumentTag::query()->orderBy('name')->paginate();

        return Inertia::render('App/Setting/DocumentTag/DocumentTagIndex', [
            'documentTypes' => DocumentTagData::collect($documentTags),
        ]);
    }

    public function create()
    {
        $documentTag = new DocumentTag;
        $documentTag->name = '';

        return Inertia::render('App/Setting/DocumentTag/DocumentTagEdit', [
            'documentTag' => DocumentTagData::from($documentTag),
        ]);
    }

    public function edit(DocumentTag $documentTag)
    {
        return Inertia::render('App/Setting/DocumentTag/DocumentTagEdit', [
            'documentTag' => DocumentTagData::from($documentTag),
        ]);
    }

    public function update(DocumentTagRequest $request, DocumentTag $documentTag)
    {
        $documentTag->update($request->validated());

        return redirect()->route('app.setting.document_tag.index');
    }

    public function store(DocumentTagRequest $request)
    {
        DocumentTag::create($request->validated());

        return redirect()->route('app.setting.document_tag.index');
    }
}
