<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\OfficeTemplateData;
use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeTemplateStoreRequest;
use App\Http\Requests\OfficeTemplateUpdateRequest;
use App\Models\OfficeTemplate;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Plank\Mediable\Exceptions\MediaUpload\ConfigurationException;
use Plank\Mediable\Exceptions\MediaUpload\FileExistsException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotFoundException;
use Plank\Mediable\Exceptions\MediaUpload\FileNotSupportedException;
use Plank\Mediable\Exceptions\MediaUpload\FileSizeException;
use Plank\Mediable\Exceptions\MediaUpload\ForbiddenException;
use Plank\Mediable\Exceptions\MediaUpload\InvalidHashException;
use Plank\Mediable\Facades\MediaUploader;

class OfficeTemplateController extends Controller
{
    public function index(): Response
    {
        $templates = OfficeTemplate::query()->orderBy('name')->paginate();

        return Inertia::render('App/Setting/OfficeTemplate/OfficeTemplateIndex', [
            'templates' => OfficeTemplateData::collect($templates),
        ]);
    }

    public function create(): Response
    {
        $template = new OfficeTemplate;

        return Inertia::render('App/Setting/OfficeTemplate/OfficeTemplateEdit', [
            'template' => OfficeTemplateData::from($template),
        ]);
    }

    public function edit(OfficeTemplate $template): Response
    {
        return Inertia::render('App/Setting/OfficeTemplate/OfficeTemplateEdit', [
            'template' => OfficeTemplateData::from($template),
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
    public function update(OfficeTemplateUpdateRequest $request, OfficeTemplate $template): RedirectResponse
    {
        $data = $request->safe()->except('file');
        $template->update($data);

        if ($request->hasFile('file')) {
            $template->detachMediaTags('file');

            $media = MediaUploader::fromSource($request->file('file'))
                ->toDestination('s3_private', 'office-templates')
                ->upload();

            $template->attachMedia($media, 'file');
        }

        return redirect()->route('app.setting.office-template.index');
    }

    public function delete(OfficeTemplate $template): RedirectResponse
    {
        $template->getMedia('file')->each->delete();
        $template->delete();

        return redirect()->route('app.setting.office-template.index');
    }

    /**
     * @throws FileNotSupportedException
     * @throws FileExistsException
     * @throws ForbiddenException
     * @throws FileNotFoundException
     * @throws FileSizeException
     * @throws InvalidHashException
     * @throws ConfigurationException
     */
    public function store(OfficeTemplateStoreRequest $request): RedirectResponse
    {
        $data = $request->safe()->except('file');
        $template = OfficeTemplate::create($data);

        if ($request->hasFile('file')) {
            $template->detachMediaTags('file');

            $media = MediaUploader::fromSource($request->file('file'))
                ->toDestination('s3_private', 'office-templates')
                ->upload();

            $template->attachMedia($media, 'file');
        }

        return redirect()->route('app.setting.office-template.index');
    }
}
