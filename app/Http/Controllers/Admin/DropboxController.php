<?php

namespace App\Http\Controllers\Admin;

use App\Data\DropboxData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DropboxRequest;
use App\Http\Requests\EmailAccountStoreRequest;
use App\Models\Dropbox;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DropboxController extends Controller
{
    public function index(): Response
    {
        $dropboxes = Dropbox::query()->orderBy('email_address')->paginate();
        return Inertia::render('Admin/Dropbox/DropboxIndex', [
            'dropboxes' => DropboxData::collect($dropboxes),
        ]);
    }

    public function create(): Response
    {
        $dropbox= new Dropbox();
        $dropbox->email_address = '';
        $dropbox->name = '';
        $dropbox->is_shared = false;
        $dropbox->is_auto_processing = false;
        return Inertia::render('Admin/Dropbox/DropboxEdit', [
            'dropbox' => DropboxData::from($dropbox),
        ]);
    }

    public function edit(Dropbox $dropbox): Response
    {
        return Inertia::render('Admin/Dropbox/DropboxEdit', [
            'dropbox' => DropboxData::from($dropbox),
        ]);
    }

    public function update(DropboxRequest $request, Dropbox $dropbox): RedirectResponse
    {

        $dropbox->update($request->validated());

        return redirect()->route('admin.dropbox.index');
    }



    public function destroy(Dropbox $dropbox): RedirectResponse
    {
        $dropbox->delete();
        return redirect()->route('admin.dropbox.index');
    }


    public function store(DropboxRequest $request): RedirectResponse
    {
        ray($request->validated());
        Dropbox::create($request->validated());
        return redirect()->route('admin.dropbox.index');
    }

}
