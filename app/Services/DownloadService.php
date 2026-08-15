<?php

namespace App\Services;

use App\Facades\FileHelperService;
use App\Mail\DownloadEmail;
use App\Models\DocumentDownload;
use App\Models\Invoice;
use App\Models\Receipt;
use App\Models\User;
use Exception;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Mail;
use Plank\Mediable\Facades\MediaUploader;
use Zip;

class DownloadService
{
    public function __construct() {}

    /**
     * @throws Exception
     */
    public function download(int $id, User $user): void
    {
        $documentDownload = DocumentDownload::find($id);
        if (! $documentDownload) {
            throw new ModelNotFoundException('DocumentDownload not found.');
        }
        $zipFileName = FileHelperService::getTempFile('zip');

        $zip = Zip::create($zipFileName);

        $items = [];
        if ($documentDownload->type === 'receipt') {
            $items = Receipt::query()->with('range_document_number')->whereIn('id', $documentDownload->ids)->get();
        }

        if ($documentDownload->type === 'invoice') {
            $items = Invoice::query()->with('range_document_number')->whereIn('id', $documentDownload->ids)->get();
        }

        foreach ($items as $item) {
            $media = $item->firstMedia('file');
            if (! $media) {
                $fallbackName = 'missing-media-'.$item->id.'.pdf';
                $zip->addFromString($fallbackName, '');

                continue;
            }
            $content = $media->contents();

            if ($item->document_number) {
                $zip->addFromString($item->issued_on->format('Ymd-').$item->document_number.'.pdf', $content);
            }
        }

        $zip->close();

        try {
            $media = MediaUploader::fromSource($zipFileName)
                ->toDestination('s3_private', 'downloads')
                ->useFilename($documentDownload->type.'s-'.Carbon::now()->format('Y-m-d_H-i-s'))
                ->upload();

            $documentDownload->attachMedia($media, 'file');

            Mail::to($user->email)->send(new DownloadEmail($user,
                $media->getTemporaryUrl(Carbon::now()->addMinutes(60))));
        } finally {
            unlink($zipFileName);
        }

    }
}
