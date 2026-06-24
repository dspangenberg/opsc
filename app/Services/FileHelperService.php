<?php

/*
 * Beleg-Portal is a twiceware solution
 * Copyright (c) 2025 by Rechtsanwalt Peter Trettin
 *
 */

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Str;
use Log;
use Spatie\TemporaryDirectory\TemporaryDirectory;

class FileHelperService
{
    public function createTempFile(UploadedFile $file): string
    {
        $tmpDir = TemporaryDirectory::make();
        $fileName = Str::random(32).'.'.$file->getClientOriginalExtension();
        $file->move($tmpDir->path(), $fileName);

        $f = $tmpDir->path().'/'.$fileName;
        Log::info('tmpFile: '.$f);

        return $f;
    }

    public function getTempFile(string $ext)
    {
        return sys_get_temp_dir().'/'.uniqid('file_').'.'.$ext;
    }

    public function createTemporaryFileFromDoc($fileName, $content, $ext = '.pdf'): string
    {
        $tempDir = storage_path('app/temp');
        if (! file_exists($tempDir)) {
            mkdir($tempDir, 0755, true);
        }
        $safeFileName = uniqid().'_'.pathinfo($fileName, PATHINFO_FILENAME).$ext;
        $realPath = $tempDir.'/'.$safeFileName;

        file_put_contents($realPath, $content);

        if (! str_starts_with(realpath($realPath), realpath($tempDir))) {
            unlink($realPath);
            throw new \RuntimeException('Path traversal detected in filename');
        }

        return $realPath;
    }
}
