<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxInboxData;
use App\Data\InboxEntryData;
use App\Http\Controllers\Controller;
use App\Models\DropboxInbox;
use App\Models\InboxEntry;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;

class InboxController extends Controller
{
    public function index($mail = null)
    {

        $mails = DropboxInbox::query()->orderBy('date', 'desc')->paginate();
        return Inertia::render('App/Inbox/InboxIndex', [
            'mails' => DropboxInboxData::collect($mails),
            'mail' => $mail ? DropboxInboxData::from(DropboxInbox::query()->where('id', $mail)->firstOrFail()) : null
        ]);
    }

    public function destroy(DropboxInbox $mail): RedirectResponse {
        $mail->delete();
        return redirect()->route('app.inbox.index');
    }

}
