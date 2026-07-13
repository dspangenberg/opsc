<?php

namespace App\Services;

use App\Events\GeneralNotificationEvent;
use App\Models\DropboxInbox;
use App\Models\DropboxMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Plank\Mediable\Facades\MediaUploader;
use Throwable;

class DropboxService
{
    /**
     * @throws Throwable
     */
    public function importMail(DropboxInbox $mail): void
    {
        $mail->loadMissing('dropbox');
        $isPrivate = $mail->dropbox?->is_private_by_default ?? false;

        DB::transaction(function () use ($mail, $isPrivate) {
            $dropboxMail = DropboxMail::create(
                [
                    'message_id' => $mail->message_id,
                    'dropbox_id' => $mail->dropbox_id,
                    'subject' => $mail->subject,
                    'from' => $mail->from,
                    'to' => $mail->to,
                    'cc' => $mail->payload['cc'] ?? [],
                    'date' => $mail->date,
                    'body' => $mail->plain_body,
                    'in_reply_to' => $mail->payload['in_reply_to'] ?? null,
                    'references' => $mail->payload['references'] ?? [],
                    'is_private' => $isPrivate,
                    'is_inbound' => $mail->dropbox->real_email !== $mail->from,
                    'is_visible_in_activity' => false,
                ]
            );

            foreach ($mail->attachments as $attachment) {
                $contentType = $attachment['contentType'] ?? null;
                $filename = $attachment['filename'] ?? null;
                $size = $attachment['size'] ?? null;
                $rawContent = $attachment['content'] ?? null;

                if ($contentType !== 'application/pdf' || ! is_string($filename) || ! is_int($size)) {
                    continue;
                }

                if (is_string($rawContent)) {
                    $content = $rawContent;
                } elseif (($rawContent['type'] ?? null) === 'Buffer' && is_array($rawContent['data'] ?? null)) {
                    $content = base64_encode(pack('C*', ...$rawContent['data']));
                } else {
                    continue;
                }

                $dropboxMailAttachment = $dropboxMail->attachments()->create([
                    'filename' => $filename,
                    'size' => $size,
                    'mime_type' => $contentType,
                ]);

                $media = MediaUploader::fromSource(
                    'data:'.$attachment['contentType'].';base64,'.$content
                )
                    ->useFilename(pathinfo($attachment['filename'], PATHINFO_FILENAME))
                    ->toDestination('s3_private', 'attachments/'.$dropboxMail->message_id)
                    ->preferClientMimeType()
                    ->onDuplicateReplace()
                    ->upload();

                if ($dropboxMail->dropbox->user_id) {
                    $dropboxMail->dropbox->loadMissing('user');
                    GeneralNotificationEvent::dispatch($dropboxMail->dropbox->user, 'Neue Test-Nachricht');
                }

                $dropboxMailAttachment->attachMedia($media, 'attachment');

            }

            $mail->delete();
        });
    }
}
