<?php

namespace App\Services;

use App\Jobs\DocumentUploadJob;
use Illuminate\Support\Facades\Process;


class MultidocService
{
    public function __construct()
    {
    }

    public function process(string $file): void {
        $fileDate = date('Y-m-d', filemtime($file));

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
            $outputName = $group['code'] ? $fileDate.'_'.$group['code'].'.pdf' : $fileDate.'_group_'.$index.'.pdf';
            $outputPath = $outputDir.'/'.$outputName;

            if (count($group['pages']) === 1) {
                // Just copy single page
                copy($group['pages'][0], $outputPath);
            } else {
                // Merge multiple pages using pdftk or pdfunite
                $pagesList = implode(' ', array_map('escapeshellarg', $group['pages']));
                Process::timeout(60)->run("pdfunite $pagesList ".escapeshellarg($outputPath));
            }

            // Dispatch upload job for the created PDF
            if (file_exists($outputPath)) {
                DocumentUploadJob::dispatch(
                    $outputPath,
                    $outputName,
                    filesize($outputPath),
                    'application/pdf',
                    filemtime($outputPath),
                    $group['code']
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
