<?php

namespace App\Http\Controllers\Admin;

use App\Data\DropboxData;
use App\Data\UserData;
use App\Http\Controllers\Controller;
use App\Http\Requests\DropboxRequest;
use App\Models\Dropbox;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Str;

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
        $dropbox->email_address = uniqid().'@dropbox.opsc.cloud';
        $dropbox->name = '';
        $dropbox->token = Str::random(32);

        $users = User::orderBy('last_name')->orderBy('first_name')->get();

        return Inertia::render('Admin/Dropbox/DropboxEdit', [
            'dropbox' => DropboxData::from($dropbox),
            'users' => UserData::collect($users),
        ]);
    }

    public function edit(Dropbox $dropbox): Response
    {
        $dropbox->load('user');
        $users = User::orderBy('last_name')->orderBy('first_name')->get();
        return Inertia::render('Admin/Dropbox/DropboxEdit', [
            'dropbox' => DropboxData::from($dropbox),
            'users' => UserData::collect($users),
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
        Dropbox::create($request->validated());
        return redirect()->route('admin.dropbox.index');
    }

}
