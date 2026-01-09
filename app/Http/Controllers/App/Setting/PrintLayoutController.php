<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\LetterheadData;
use App\Data\PrintLayoutData;
use App\Http\Controllers\Controller;
use App\Http\Requests\PrintLayoutRequest;
use App\Models\Letterhead;
use App\Models\PrintLayout;
use Inertia\Inertia;

class PrintLayoutController extends Controller
{
    public function index()
    {
        $layouts = PrintLayout::query()->with('letterhead')->orderBy('title')->paginate();

        return Inertia::render('App/Setting/PrintLayout/PrintLayoutIndex', [
            'layouts' => PrintLayoutData::collect($layouts),
        ]);
    }

    public function create()
    {
        $layout = new PrintLayout();
        $letterheads = Letterhead::query()->orderBy('title')->get();

        return Inertia::render('App/Setting/PrintLayout/PrintLayoutEdit', [
            'layout' => PrintLayoutData::from($layout),
            'letterheads' => LetterheadData::collect($letterheads),
        ]);
    }

    public function edit(PrintLayout $layout)
    {
        $letterheads = Letterhead::query()->orderBy('title')->get();
        return Inertia::render('App/Setting/PrintLayout/PrintLayoutEdit', [
            'layout' => PrintLayoutData::from($layout),
            'letterheads' => LetterheadData::collect($letterheads),
        ]);
    }

       public function update(PrintLayoutRequest $request, PrintLayout $layout)
    {
        $layout->update($request->validated());
        return redirect()->route('app.setting.letterhead.index');
    }

    public function delete(PrintLayout $layout)
    {
        $layout->delete();
        return redirect()->route('app.setting.letterhead.index');
    }

    public function store(PrintLayoutRequest $request)
    {
        PrintLayout::create($request->validated());
        return redirect()->route('app.setting.letterhead.index');
    }
}
