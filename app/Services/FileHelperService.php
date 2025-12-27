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
}
