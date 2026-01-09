<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\LetterheadData;
use App\Http\Controllers\Controller;
use App\Http\Requests\GlobalCssUpdateRequest;
use App\Http\Requests\LetterheadRequest;
use App\Models\Letterhead;
use App\Settings\GeneralSettings;
use Inertia\Inertia;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;

class LetterheadController extends Controller
{
    public function index()
    {
        $letterheads = Letterhead::query()->orderBy('title')->paginate();

        return Inertia::render('App/Setting/Letterhead/LetterheadIndex', [
            'letterheads' => LetterheadData::collect($letterheads),
        ]);
    }

    public function create()
    {
        $letterhead = new Letterhead;

        return Inertia::render('App/Setting/Letterhead/LetterheadEdit', [
            'letterhead' => LetterheadData::from($letterhead),
        ]);
    }

    public function editGlobalCSS()
    {
        $settings = app(GeneralSettings::class);

        return Inertia::render('App/Setting/Letterhead/GlobalCssEdit', [
            'css' => $settings->pdf_global_css
        ]);
    }

    public function updateGlobalCSS(GlobalCssUpdateRequest $request)
    {
        $settings = app(GeneralSettings::class);
        $settings->pdf_global_css = $request->validated()['css'];
        $settings->save();

        return redirect()->route('app.setting.global-css-edit');
    }

    public function edit(Letterhead $letterhead)
    {
        return Inertia::render('App/Setting/Letterhead/LetterheadEdit', [
            'letterhead' => LetterheadData::from($letterhead),
        ]);
    }

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws FileNotFoundException
     * @throws ForbiddenException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     */
    public function update(LetterheadRequest $request, Letterhead $letterhead)
    {
        $letterhead->update($request->validated());

        if ($request->hasFile('file')) {
            $letterhead->detachMediaTags('file');

            $media = MediaUploader::fromSource($request->file('file'))
                ->toDestination('s3_private', 'letterheads')
                ->upload();

            $letterhead->attachMedia($media, 'file');
        }

        return redirect()->route('app.setting.letterhead.index');
    }

    public function delete(Letterhead $letterhead)
    {
        $letterhead->delete();

        return redirect()->route('app.setting.letterhead.index');
    }

    public function store(LetterheadRequest $request)
    {
        Letterhead::create($request->validated());

        return redirect()->route('app.setting.letterhead.index');
    }
}
