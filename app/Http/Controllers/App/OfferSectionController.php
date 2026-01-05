<?php

namespace App\Http\Controllers\App;

use App\Data\DocumentTypeData;
use App\Data\OfferSectionData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentTypeRequest;
use App\Http\Requests\OfferSectionRequest;
use App\Models\DocumentType;
use App\Models\OfferSection;
use Inertia\Inertia;

class OfferSectionController extends Controller
{
    public function index()
    {
        $sections = OfferSection::query()->orderBy('pos')->orderBy('id')->paginate();
        return Inertia::render('App/OfferSection/OfferSectionIndex', [
            'sections' => OfferSectionData::collect($sections),
        ]);
    }

    public function create() {
        $pos = OfferSection::query()->max('pos') + 10;
        $section = new OfferSection();
        $section->pos = $pos;
        return Inertia::modal('App/OfferSection/OfferSectionEdit', [
            'section' => OfferSectionData::from($section),
        ])->baseRoute('app.offer.section.index');
    }

    public function edit(OfferSection $section) {
        return Inertia::modal('App/OfferSection/OfferSectionEdit', [
            'section' => OfferSectionData::from($section),
        ])->baseRoute('app.offer.section.index');
    }

    public function update(OfferSectionRequest $request, OfferSection $section) {
        $section->update($request->validated());
        return redirect()->route('app.offer.section.index');
    }

    public function delete(OfferSection $section) {
        $section->delete();
        return redirect()->route('app.offer.section.index');
    }

    public function store(OfferSectionRequest $request) {
        OfferSection::create($request->validated());
        return redirect()->route('app.offer.section.index');
    }
}
