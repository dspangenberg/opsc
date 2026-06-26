<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxData;
use App\Data\DropboxMailData;
use App\Data\ProjectData;
use App\Data\SimpleContactData;
use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Dropbox;
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

        if (! $dropbox->is_shared && $dropbox->user_id !== auth()->user()->id) {
            abort(403);
        }

        if ($mail) {
            $mail = DropboxMail::query()
                ->with(['attachments', 'dropbox'])
                ->whereKey($mail)
                ->where('dropbox_id', $dropbox->id)
                ->firstOrFail();
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

        return Inertia::render('App/Email/EmailIndex', [
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
    public function move(Dropbox $dropbox, DropboxMail $mail, Dropbox $newDropbox): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
            || (! $newDropbox->is_shared && $newDropbox->user_id !== auth()->id())
        ) {
            abort(403);
        }
        $mail->dropbox_id = $newDropbox->id;
        $mail->save();

        return redirect(route('app.email.index', ['dropbox' => $dropbox->id]));
    }

    public function destroy(Dropbox $dropbox, DropboxMail $mail): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }
        $mail->delete();

        return redirect(route('app.email.index', ['dropbox' => $dropbox->id]));
    }
}
