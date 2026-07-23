<?php

namespace App\Http\Controllers\App;

use App\Data\DropboxData;
use App\Data\DropboxMailData;
use App\Data\ProjectData;
use App\Data\SimpleContactData;
use App\Facades\FileHelperService;
use App\Http\Controllers\Controller;
use App\Http\Requests\DropboxMailSnoozeRequest;
use App\Http\Requests\EmailBulkRequest;
use App\Jobs\DocumentUploadJob;
use App\Jobs\ReceiptUploadFromMailAttchmentJob;
use App\Models\Contact;
use App\Models\Dropbox;
use App\Models\DropboxMail;
use App\Models\DropboxMailAttachment;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\HeaderUtils;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Throwable;

class EmailController extends Controller
{
    public function index(Request $request, Dropbox $dropbox, $mail = null): Response
    {

        if (! $dropbox->is_shared && $dropbox->user_id !== auth()->user()->id) {
            abort(403);
        }

        if ($mail) {
            $mail = DropboxMail::query()
                ->with(['attachments', 'dropbox'])
                ->whereKey($mail)
                ->where('dropbox_id', $dropbox->id)
                ->withTrashed()
                ->firstOrFail();
            if ($mail) {
                if (! $mail->seen_at) {
                    $mail->seen_at = now();
                    $mail->save();
                }
            }
        }

        $view = $request->validate([
            'view' => ['sometimes', 'string', 'in:inbox,sent,archived,trash,snoozed'],
        ])['view'] ?? 'inbox';

        $contacts = Contact::query()->select(['id', 'name', 'first_name'])->whereHas('mails')->where('is_archived',
            false)->with('mails')->orderBy('name')->orderBy('first_name')->get();
        $projects = Project::query()->where('is_archived', false)->orderBy('name')->get();

        $mails = DropboxMail::query()->view($view)->withCount('attachments')->where('dropbox_id',
            $dropbox->id)->orderBy('date', 'desc')->paginate(50);

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
    public function attachmentPreview(
        Dropbox $dropbox,
        DropboxMail $mail,
        DropboxMailAttachment $attachment
    ): StreamedResponse|RedirectResponse {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }

        if ($attachment->dropbox_mail_id !== $mail->id) {
            abort(403);
        }

        if ($attachment->hasMedia('attachment')) {

            $media = $attachment->firstMedia('attachment');
            if ($media->exists()) {
                return response()->stream(function () use ($media) {
                    $stream = $media->stream();
                    while (! $stream->eof()) {
                        $bytes = $stream->read(8192);
                        echo $bytes;
                    }
                    $stream->close();
                }, 200, [
                    'Content-Type' => $media->mime_type ?? 'application/pdf',
                    'Content-Disposition' => HeaderUtils::makeDisposition(
                        HeaderUtils::DISPOSITION_INLINE,
                        $attachment->filename,
                        $attachment->filename,
                    ),
                    'Content-Length' => $media->size,
                ]);
            }
        } else {
            abort(404);
        }

        return redirect()->back();
    }

    /**
     * @throws Throwable
     */
    public function importAttachmentAsReceipt(
        Dropbox $dropbox,
        DropboxMail $mail,
        DropboxMailAttachment $attachment
    ): RedirectResponse {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }

        if ($attachment->dropbox_mail_id !== $mail->id) {
            abort(403);
        }

        if ($attachment->hasMedia('attachment')) {

            $media = $attachment->firstMedia('attachment');
            if ($media->exists()) {
                ReceiptUploadFromMailAttchmentJob::dispatch($media);
            }
        } else {
            abort(404);
        }

        return redirect()->back();
    }

    public function importAttachmentAsDocument(
        Dropbox $dropbox,
        DropboxMail $mail,
        DropboxMailAttachment $attachment
    ): RedirectResponse {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }

        if ($attachment->dropbox_mail_id !== $mail->id) {
            abort(403);
        }

        if ($attachment->hasMedia('attachment')) {

            $media = $attachment->firstMedia('attachment');
            if ($media->exists()) {
                $realPath = FileHelperService::createTemporaryFileFromDoc($media->filename, $media->contents());
                DocumentUploadJob::dispatch($realPath, $media->filename, $media->size, $media->mime_type);
            }
        } else {
            abort(404);
        }

        return redirect()->back();
    }

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

    public function snooze(DropboxMailSnoozeRequest $request, Dropbox $dropbox, DropboxMail $mail): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }

        $mail->snoozed_until = $request->validated('snoozed_until');
        $mail->archived_at = null;
        $mail->save();

        return redirect()->back();
    }

    public function unsnooze(Dropbox $dropbox, DropboxMail $mail): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }

        $mail->snoozed_until = null;
        $mail->save();

        return redirect()->back();
    }

    public function bulkTrash(EmailBulkRequest $request, Dropbox $dropbox): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
        ) {
            abort(403);
        }

        $ids = $request->getEmailIds();
        $mails = DropboxMail::query()->where('dropbox_id', $dropbox->id)->whereIn('id', $ids)->withTrashed()->get();

        $mails->each(function ($mail) {
            $mail->delete();
        });

        Inertia::flash('toast', ['type' => 'success', 'message' => 'Die E-Mails wurden in den Papierkorb verschoben.']);

        return redirect()->back();
    }

    public function archive(Dropbox $dropbox, DropboxMail $mail): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }
        $mail->archived_at = now();
        $mail->snoozed_until = null;
        $mail->save();

        return redirect()->back();
    }

    public function unarchive(Dropbox $dropbox, DropboxMail $mail): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }
        $mail->archived_at = null;
        $mail->save();

        return redirect()->back();
    }

    public function restore(Dropbox $dropbox, DropboxMail $mail): RedirectResponse
    {
        if (
            (! $dropbox->is_shared && $dropbox->user_id !== auth()->id())
            || $mail->dropbox_id !== $dropbox->id
        ) {
            abort(403);
        }
        $mail->restore();

        return redirect(route('app.email.index', ['dropbox' => $dropbox->id]));
    }

    public function trash(Dropbox $dropbox, DropboxMail $mail): RedirectResponse
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
