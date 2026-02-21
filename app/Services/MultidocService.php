<?php

namespace App\Services;

use App\Jobs\DocumentUploadJob;
use App\Facades\OcrService;
use Exception;
use Illuminate\Support\Facades\Process;
use Smalot\PdfParser\Parser;
use Spatie\PdfToImage\Exceptions\PdfDoesNotExist;


class MultidocService
{
    public function __construct()
    {
    }

    /**
     */
    protected function extractPdfDate(string $text, string $pdfPath): string
    {
        if ($text) {
            // Search for German date patterns with month names: 4. August 2022 or 04. August 2022
            $months = [
                'januar' => '01', 'februar' => '02', 'märz' => '03', 'april' => '04',
                'mai' => '05', 'juni' => '06', 'juli' => '07', 'august' => '08',
                'september' => '09', 'oktober' => '10', 'november' => '11', 'dezember' => '12'
            ];

            $monthPattern = implode('|', array_keys($months));
            if (preg_match('/(\d{1,2})\.\s*('.$monthPattern.')\s+(\d{4})/iu', $text, $matches)) {
                $day = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
                $month = $months[mb_strtolower($matches[2])];
                $year = $matches[3];

                return $year.'-'.$month.'-'.$day;
            }

            // Search for German date patterns: DD.MM.YYYY or DD.MM.YY
            if (preg_match('/(\d{1,2})\.(\d{1,2})\.(\d{4})/', $text, $matches)) {
                $day = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
                $month = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
                $year = $matches[3];

                return $year.'-'.$month.'-'.$day;
            }

            if (preg_match('/(\d{1,2})\.(\d{1,2})\.(\d{2})/', $text, $matches)) {
                $day = str_pad($matches[1], 2, '0', STR_PAD_LEFT);
                $month = str_pad($matches[2], 2, '0', STR_PAD_LEFT);
                $year = '20'.$matches[3];

                return $year.'-'.$month.'-'.$day;
            }
        }

        // Fallback to file modification time
        return date('Y-m-d', filemtime($pdfPath));
    }

    /**
     * @throws PdfDoesNotExist
     */
    public function process(string $file, string $orgFilename): void {

        // Separate PDF pages first
        $tmpDir = sys_get_temp_dir().'/'.uniqid('pdf_');
        mkdir($tmpDir);

        // Split PDF into individual pages as PDF files
        Process::timeout(300)->run(
            'pdfseparate '.escapeshellarg($file).' '.escapeshellarg($tmpDir.'/page_%03d.pdf')
        );

        $pdfPages = glob($tmpDir.'/page_*.pdf');

        // Now convert pages to PNG for barcode scanning
        $imgDir = sys_get_temp_dir().'/'.uniqid('img_');
        mkdir($imgDir);

        Process::timeout(300)->run(
            'gs -dSAFER -dBATCH -dNOPAUSE -sDEVICE=png16m -r150 -sOutputFile='.
            escapeshellarg($imgDir.'/page_%03d.png').' '.
            escapeshellarg($file)
        );

        $images = glob($imgDir.'/page_*.png');

        // Scan for barcodes and map to page numbers
        $barcodes = [];
        foreach ($images as $imagePath) {
            preg_match('/page_(\d+)\.png/', $imagePath, $matches);
            $pageNumber = intval($matches[1]);

            $result = Process::timeout(30)->run('zbarimg --quiet --raw -S*.enable=0 -Si25.enable=1 '.escapeshellarg($imagePath));

            if ($result->successful()) {
                $output = trim($result->output());
                if (!empty($output)) {
                    $barcodes[$pageNumber] = intval($output);
                }
            }
        }

        // Group pages by barcode
        $groups = [];
        $currentGroup = null;
        $currentCode = null;

        foreach ($pdfPages as $pdfPage) {
            preg_match('/page_(\d+)\.pdf/', $pdfPage, $matches);
            $pageNumber = intval($matches[1]);

            // Check if this page has a barcode
            if (isset($barcodes[$pageNumber])) {
                // Start new group
                if ($currentGroup !== null) {
                    $groups[] = [
                        'code' => $currentCode,
                        'pages' => $currentGroup,
                    ];
                }
                $currentCode = $barcodes[$pageNumber];
                $currentGroup = [$pdfPage];
            } else {
                // Add to current group or create default group
                if ($currentGroup === null) {
                    $currentCode = null;
                    $currentGroup = [$pdfPage];
                } else {
                    $currentGroup[] = $pdfPage;
                }
            }
        }

        // Add last group
        if ($currentGroup !== null) {
            $groups[] = [
                'code' => $currentCode,
                'pages' => $currentGroup,
            ];
        }

        // Create merged PDFs for each group
        $outputDir = storage_path('app/temp/multidoc');
        if (!file_exists($outputDir)) {
            mkdir($outputDir, 0755, true);
        }

        foreach ($groups as $index => $group) {
            // Create temporary output path first
            $tmpOutputPath = $outputDir.'/tmp_'.uniqid().'.pdf';

            if (count($group['pages']) === 1) {
                // Just copy single page
                copy($group['pages'][0], $tmpOutputPath);
            } else {
                // Merge multiple pages using pdftk or pdfunite
                $pagesList = implode(' ', array_map('escapeshellarg', $group['pages']));
                Process::timeout(60)->run("pdfunite $pagesList ".escapeshellarg($tmpOutputPath));
            }

            $fullText = '';

            // Extract date from the merged PDF
            if (file_exists($tmpOutputPath)) {
                try {
                    $parser = new Parser;
                    $pdf = $parser->parseFile($tmpOutputPath);
                    $fullText = $pdf->getText();
                }  catch (Exception $e) {
                }

                if (!trim($fullText)) {
                    $fullText = OcrService::run($tmpOutputPath);
                }


                $fileDate = $this->extractPdfDate($fullText, $tmpOutputPath);
                $outputName = $group['code'] ? $fileDate.'_'.$group['code'].'.pdf' : $fileDate.'_group_'.$index.'.pdf';
                $outputPath = $outputDir.'/'.$outputName;

                // Rename to final name
                rename($tmpOutputPath, $outputPath);

                // Convert extracted date to Unix timestamp
                $fileMTime = strtotime($fileDate) ?: filemtime($outputPath);

                // Dispatch upload job for the created PDF
                DocumentUploadJob::dispatch(
                    $outputPath,
                    $outputName,
                    filesize($outputPath),
                    'application/pdf',
                    $fileMTime,
                    $group['code'],
                    $orgFilename,
                    $fullText
                );
            }
        }

        // Cleanup
        array_map('unlink', $images);
        array_map('unlink', $pdfPages);
        rmdir($imgDir);
        rmdir($tmpDir);
    }
}
