<?php

/*
 * Beleg-Portal is a twiceware solution
 * Copyright (c) 2025 by Rechtsanwalt Peter Trettin
 *
 */

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Spatie\TemporaryDirectory\TemporaryDirectory;
use Log;

class FileHelperService
{
    public function createTempFile(UploadedFile $file): string
    {

        ds($file);
        $tmpDir = TemporaryDirectory::make();
        $fileName = Str::random(32).'.'.$file->getClientOriginalExtension();
        $file->move($tmpDir->path(), $fileName);


        $f = $tmpDir->path() . '/'.$fileName;
        Log::info('tmpFile: ' .$f);
        ds($f);
        return $f;
    }

    public function createTemporaryFileFromDoc($fileName, $content): string
    {
        $tempFile = storage_path('app/temp');
        if (!file_exists($tempFile)) {
            mkdir($tempFile, 0755, true);
        }
        $fileName = uniqid().'_'.$fileName;
        file_put_contents($tempFile.'/'.$fileName, $content);
        $realPath = $tempFile.'/'.$fileName;
        return $realPath;
    }
}
