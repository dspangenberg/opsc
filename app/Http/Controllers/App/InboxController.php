<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxInboxData;
use App\Data\DropboxInboxIndexData;
use App\Http\Controllers\Controller;
use App\Models\DropboxInbox;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class InboxController extends Controller
{
    public function index($mail = null): Response
    {
        $mails = DropboxInbox::query()->orderBy('date', 'desc')->paginate();
        return Inertia::render('App/Inbox/InboxIndex', [
            'mails' => DropboxInboxIndexData::collect($mails),
            'mail' => $mail ? DropboxInboxData::from(DropboxInbox::query()->with('dropbox')->where('id', $mail)->firstOrFail()) : null
        ]);
    }

    public function destroy(DropboxInbox $mail): RedirectResponse {
        $mail->delete();
        return redirect()->route('app.inbox.index');
    }

}
