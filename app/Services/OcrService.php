<?php

namespace App\Services;

use Spatie\PdfToImage\Exceptions\PdfDoesNotExist;
use Spatie\PdfToImage\Pdf;
use thiagoalessio\TesseractOCR\TesseractOCR;

class OcrService
{
    /**
     * @throws PdfDoesNotExist
     */
    public function run(string $file): string {
        $pages = $this->createImages($file);
        $fullText = '';
        foreach ($pages as $page) {
            $text = new TesseractOCR($page)
                ->lang('eng', 'deu')
                ->run();
            $fullText .= $text;
            unlink($page);
        }

        return $fullText;
    }

    /**
     * @throws PdfDoesNotExist
     */
    private function createImages($file): array {
        $ghostscriptPath = config('pdf.ghostscript_path');

        if ($ghostscriptPath && $ghostscriptPath !== 'gs' && file_exists($ghostscriptPath)) {
            putenv('MAGICK_GHOSTSCRIPT='.$ghostscriptPath);
            putenv('PATH='.dirname($ghostscriptPath).':'.getenv('PATH'));
        }

        $tmpDir = sys_get_temp_dir();
        $pdf = new Pdf($file);

        return $pdf->resolution(300)->saveAllPages($tmpDir);


    }
}
