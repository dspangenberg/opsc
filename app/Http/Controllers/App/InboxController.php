<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxInboxData;
use App\Data\DropboxInboxIndexData;
use App\Data\ProjectData;
use App\Data\SimpleContactData;
use App\Http\Controllers\Controller;
use App\Http\Requests\MailImportRequest;
use App\Models\Contact;
use App\Models\DropboxInbox;
use App\Models\DropboxMail;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class InboxController extends Controller
{
    public function index($mail = null): Response
    {
        if ($mail) {
            $mail = DropboxInbox::query()->with('dropbox')->where('id', $mail)->first();
            if ($mail) {
                if (! $mail->seen_at) {
                    $mail->seen_at = now();
                    $mail->save();
                }
            }
        }

        $contacts = Contact::query()->select(['id', 'name', 'first_name'])->whereHas('mails')->where('is_archived', false)->with('mails')->orderBy('name')->orderBy('first_name')->get();
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
    public function import(MailImportRequest $request, $mail): RedirectResponse
    {
        $mail = DropboxInbox::query()->with('dropbox')->where('id', $mail)->first();
        DB::transaction(function () use ($request, $mail) {
            // $request->validated()
            $dropboxMail = DropboxMail::create(
                [
                    'message_id' => $mail->message_id,
                    'dropbox_id' => $mail->dropbox_id,
                    'subject' => $mail->subject,
                    'from' => $mail->from,
                    'to' => $mail->to,
                    'cc' => $mail->payload['cc'],
                    'date' => $mail->date,
                    'body' => $mail->plain_body,
                    'in_reply_to' => $mail->payload['in_reply_to'],
                    'references' => $mail->payload['references'],
                    'is_private' => $request->validated('is_private'),
                ]
            );

            $dropboxMail->links()->create([
                'mailable_type' => Contact::class,
                'mailable_id' => $request->validated('contact_id'),
            ]);

            if ($request->validated('project_id')) {
                $dropboxMail->links()->create([
                    'mailable_type' => Project::class,
                    'mailable_id' => $request->validated('project_id'),
                ]);
            }

            $mail->delete();
        });

        return redirect()->route('app.inbox.index');
    }

    public function destroy(DropboxInbox $mail): RedirectResponse
    {
        $mail->delete();

        return redirect()->route('app.inbox.index');
    }
}
