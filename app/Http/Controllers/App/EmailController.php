<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxData;
use App\Data\DropboxMailData;
use App\Data\ProjectData;
use App\Data\SimpleContactData;
use App\Http\Controllers\Controller;
use App\Jobs\DropboxImportJob;
use App\Models\Contact;
use App\Models\Dropbox;
use App\Models\DropboxInbox;
use App\Models\DropboxMail;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class EmailController extends Controller
{
    public function index(Dropbox $dropbox, $mail = null): Response
    {

        if ($mail) {
            $mail = DropboxMail::query()->with('attachments')->with('dropbox')->where('id', $mail)->first();
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

        $mails = DropboxMail::query()->where('dropbox_id', $dropbox->id)->orderBy('date', 'desc')->paginate();

        return Inertia::render('App/Email/Index', [
            'mails' => DropboxMailData::collect($mails),
            'mail' => $mail ? DropboxMailData::from($mail) : null,
            'dropbox' => DropboxData::from($dropbox),
            'contacts' => SimpleContactData::collect($contacts),
            'projects' => ProjectData::collect($projects),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function import($mail): RedirectResponse
    {
        $mail = DropboxInbox::query()->with('dropbox')->where('id', $mail)->first();
        DropboxImportJob::dispatch($mail);

        return redirect()->route('app.inbox.index');
    }

    public function destroy(DropboxInbox $mail): RedirectResponse
    {
        $mail->delete();

        return redirect()->route('app.inbox.index');
    }
}
