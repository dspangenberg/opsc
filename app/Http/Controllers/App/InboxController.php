<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxInboxData;
use App\Data\DropboxInboxIndexData;
use App\Data\ProjectData;
use App\Data\SimpleContactData;
use App\Http\Controllers\Controller;
use App\Jobs\DropboxImportJob;
use App\Models\Contact;
use App\Models\DropboxInbox;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class InboxController extends Controller
{
    public function index(?int $mail = null): Response
    {

        if (! Auth::user()->is_admin) {
            abort(403);
        }

        if ($mail) {
            $mail = DropboxInbox::query()->with('dropbox')->where('id', $mail)->first();
            if ($mail) {
                if (! $mail->seen_at) {
                    $mail->seen_at = now();
                    $mail->save();
                }
            }
        }

        $contacts = Contact::query()->select(['id', 'name', 'first_name'])->whereHas('mails')->where('is_archived',
            false)->with('mails')->orderBy('name')->orderBy('first_name')->get();
        $projects = Project::query()->where('is_archived', false)->orderBy('name')->get();

        $mails = DropboxInbox::query()->orderBy('date', 'desc')->paginate();

        return Inertia::render('App/Inbox/InboxIndex', [
            'mails' => DropboxInboxIndexData::collect($mails),
            'mail' => $mail ? DropboxInboxData::from($mail) : null,
            'contacts' => SimpleContactData::collect($contacts),
            'projects' => ProjectData::collect($projects),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function import(int $mail): RedirectResponse
    {
        if (! Auth::user()->is_admin) {
            abort(403);
        }

        $mail = DropboxInbox::query()->with('dropbox')->where('id', $mail)->first();

        if (! $mail) {
            abort(404);
        }

        DropboxImportJob::dispatch($mail);

        return redirect()->route('admin.inbox.index');
    }

    public function destroy(DropboxInbox $mail): RedirectResponse
    {
        if (! Auth::user()->is_admin) {
            abort(403);
        }

        $mail->delete();

        return redirect()->route('admin.inbox.index');
    }
}
