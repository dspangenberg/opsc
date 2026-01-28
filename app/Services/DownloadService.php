<?php

namespace App\Services;

use App\Mail\DownloadEmail;
use App\Models\DocumentDownload;
use App\Facades\FileHelperService;
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
    public function __construct()
    {
    }

    /**
     * @throws Exception
     */
    public function download(int $id, User $user): void {
        $documentDownload = DocumentDownload::find($id);
        if (!$documentDownload) {
            throw new ModelNotFoundException('DocumentDownload not found.');
        }
        $zipFileName = FileHelperService::getTempFile('zip');

        $zip = Zip::create($zipFileName);

        $receipts = Receipt::query()->with('range_document_number')->whereIn('id', $documentDownload->ids)->get();


        foreach ($receipts as $receipt) {
            $media = $receipt->firstMedia('file');
            if (!$media) {
                $fallbackName = 'missing-media-'.$receipt->id.'.pdf';
                $zip->addFromString($fallbackName, '');
                continue;
            }
            $content = $media->contents();

            if ($receipt->document_number) {
                $zip->addFromString($receipt->document_number.'.pdf', $content);
            }
        }

        $zip->close();

        try {
            $media = MediaUploader::fromSource($zipFileName)
                ->toDestination('s3_private', 'download/'.$documentDownload->id.'.zip')
                ->upload();

            Mail::to($user->email)->send(new DownloadEmail($user,
                $media->getTemporaryUrl(Carbon::now()->addMinutes(60))));
        } finally {
            unlink($zipFileName);
        }

    }
}
