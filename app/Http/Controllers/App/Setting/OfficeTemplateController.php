<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\OfficeTemplateData;
use App\Http\Controllers\Controller;
use App\Http\Requests\OfficeTemplateStoreRequest;
use App\Http\Requests\OfficeTemplateUpdateRequest;
use App\Models\OfficeTemplate;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
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
use Throwable;

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
     * @throws Throwable
     */
    public function update(OfficeTemplateUpdateRequest $request, OfficeTemplate $template): RedirectResponse
    {
        DB::transaction(function () use ($request, $template): void {
            $template->update($request->safe()->except('file'));

            if (!$request->hasFile('file')) {
                return;
            }

            $existingMedia = $template->getMedia('file');
            $newMedia = MediaUploader::fromSource($request->file('file'))
                ->toDestination('s3_private', 'office-templates')
                ->upload();

            $template->attachMedia($newMedia, 'file');
            $existingMedia->each->delete();


        });
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
     * @throws Throwable
     */
    public function store(OfficeTemplateStoreRequest $request): RedirectResponse
    {
        DB::transaction(function () use ($request): void {
            $template = OfficeTemplate::create($request->safe()->except('file'));
            $media = MediaUploader::fromSource($request->file('file'))
                ->toDestination('s3_private', 'office-templates')
                ->upload();
            $template->attachMedia($media, 'file');
        });

        return redirect()->route('app.setting.office-template.index');
    }
}
