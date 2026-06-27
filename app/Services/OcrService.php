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
    public function run(string $file): string
    {

        $pages = $this->createImages($file);
        $fullText = '';
        foreach ($pages as $i => $page) {
            try {
                $text = (new TesseractOCR($page))
                    ->lang('eng', 'deu')
                    ->run();
                $fullText .= $text;
            } catch (\Throwable $e) {
                ray("Fehler auf Seite $i:", $e->getMessage());
            } finally {
                @unlink($page);
            }
        }

        return $fullText;
    }

    /**
     * @throws PdfDoesNotExist
     */
    private function createImages(string $file): array
    {
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
