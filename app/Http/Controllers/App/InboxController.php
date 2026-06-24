<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxInboxData;
use App\Data\DropboxInboxIndexData;
use App\Data\ProjectData;
use App\Data\SimpleContactData;
use App\Facades\FileHelperService;
use App\Facades\ReceiptService;
use App\Http\Controllers\Controller;
use App\Http\Requests\MailImportRequest;
use App\Jobs\DropboxImportJob;
use App\Models\Contact;
use App\Models\DropboxInbox;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
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
    public function import(MailImportRequest $request, $mail): RedirectResponse
    {
        $mail = DropboxInbox::query()->with('dropbox')->where('id', $mail)->first();
        DropboxImportJob::dispatch($mail);

        return redirect()->route('app.inbox.index');
    }

    public function processAttachmentsAsReciept(MailImportRequest $request, $mail)
    {
        foreach ($mail->attachments as $attachment) {
            if ($attachment['contentType'] !== 'application/pdf') {
                continue;
            }

            $content = base64_encode($attachment['content']);
            $reciept = FileHelperService::createTemporaryFileFromDoc($attachment['filename'], $content);
            ReceiptService::processMailAttachment($reciept, $attachment['filename'], $attachment['size']);

        }
    }

    public function destroy(DropboxInbox $mail): RedirectResponse
    {
        $mail->delete();

        return redirect()->route('app.inbox.index');
    }
}
