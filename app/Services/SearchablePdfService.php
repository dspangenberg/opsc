<?php

namespace App\Services;

use mishahawthorn\OCRmyPDF\NoWritePermissionsException;
use mishahawthorn\OCRmyPDF\OCRmyPDF;
use mishahawthorn\OCRmyPDF\OCRmyPDFException;
use mishahawthorn\OCRmyPDF\OCRmyPDFNotFoundException;
use mishahawthorn\OCRmyPDF\ProcessTimeoutException;
use mishahawthorn\OCRmyPDF\UnsuccessfulCommandException;

class SearchablePdfService
{
    /**
     * `
     *
     * @return array ` array{pdf_path: string, fulltext: ?string}
     *
     * @throws NoWritePermissionsException
     * @throws OCRmyPDFException
     * @throws OCRmyPDFNotFoundException
     * @throws ProcessTimeoutException
     * @throws UnsuccessfulCommandException
     */
    public function create(string $inputPdfPath): array
    {
        $ocrmypdfPath = config('pdf.ocrmypdf_path');

        $ocr = OCRmyPDF::make($inputPdfPath)
            ->setExecutable($ocrmypdfPath)
            ->language('eng', 'deu')
            ->deskew()
            ->rotatePages()
            ->clean()
            ->setThreadLimit(4)
            ->extractText();

        $pdfPath = $ocr->run();
        $fullText = $ocr->getText();

        return [
            'pdf_path' => $pdfPath,
            'fulltext' => $fullText,
        ];
    }
}
