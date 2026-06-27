<?php

namespace App\Services;

use mishahawthorn\OCRmyPDF\OCRmyPDF;

class SearchablePdfService
{
    /**
     * `@return` array{pdf_path: string, fulltext: ?string}
     */
    public function create(string $inputPdfPath): array
    {
        $outputPdfPath = sys_get_temp_dir().'/'.uniqid('ocr_pdf_', true).'.pdf';
        $sidecarPath = sys_get_temp_dir().'/'.uniqid('ocr_text_', true).'.txt';

        $ocrmypdfPath = config('pdf.ocrmypdf_path');

        $ocr = OCRmyPDF::make($inputPdfPath)
            ->setExecutable($ocrmypdfPath)
            ->language('eng', 'deu') // -l eng+deu
            ->deskew()               // --deskew
            ->rotatePages()          // --rotate-pages
            ->clean()                // --clean
            ->setThreadLimit(4)      // --jobs 4
            ->extractText();

        $pdfPath = $ocr->run();
        $fullText = $ocr->getText();

        return [
            'pdf_path' => $pdfPath,
            'fulltext' => $fullText,
        ];
    }
}
