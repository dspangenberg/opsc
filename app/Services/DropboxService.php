<?php

namespace App\Services;

use App\Models\DropboxInbox;
use App\Models\DropboxMail;
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
        $mail->load('dropbox');
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
                ]
            );

            foreach ($mail->attachments as $attachment) {
                if ($attachment['contentType'] !== 'application/pdf') {
                    continue;
                }

                if (is_string($attachment['content'])) {
                    $content = $attachment['content'];
                } elseif (($attachment['content']['type'] ?? null) === 'Buffer') {
                    $content = base64_encode(pack('C*', ...$attachment['content']['data']));
                } else {
                    continue;
                }

                $dropboxMailAttachment = $dropboxMail->attachments()->create([
                    'filename' => $attachment['filename'],
                    'size' => $attachment['size'],
                    'mime_type' => $attachment['contentType'],
                ]);

                $media = MediaUploader::fromSource(
                    'data:'.$attachment['contentType'].';base64,'.$content
                )
                    ->useFilename(pathinfo($attachment['filename'], PATHINFO_FILENAME))
                    ->toDestination('s3_private', 'attachments/'.$dropboxMail->message_id)
                    ->preferClientMimeType()
                    ->onDuplicateReplace()
                    ->upload();

                $dropboxMailAttachment->attachMedia($media, 'attachments');

            }

            $mail->delete();
        });
    }
}
