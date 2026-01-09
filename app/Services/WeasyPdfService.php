<?php

namespace App\Services;

use App\Facades\FileHelperService;
use App\Models\Document;
use App\Models\Letterhead;
use App\Models\PrintLayout;
use App\Settings\GeneralSettings;
use Config;
use Exception;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Pontedilana\PhpWeasyPrint\Pdf;
use Process;

class WeasyPdfService
{
    /**
     * @throws Exception
     */
    private function convertToPdfA(string $inputFile): string
    {
        $outputFile = self::getOutputFile();
        $gsPath = config('pdf.ghostscript_path', '/usr/bin/gs');

        $command = sprintf(
            '%s -dPDFA=3 -dBATCH -dNOPAUSE -sColorConversionStrategy=RGB -sDEVICE=pdfwrite -dPDFACompatibilityPolicy=1 -sOutputFile=%s %s 2>&1',
            escapeshellarg($gsPath),
            escapeshellarg($outputFile),
            escapeshellarg($inputFile)
        );

        $result = Process::run($command);

        if ($result->failed()) {
            throw new Exception('PDF/A conversion failed: '.$result->output());
        }

        return $outputFile;
    }

    private function getOutputFile(): string
    {
        return storage_path('system/tmp').'/'.Str::random().'.pdf';
    }

    private function getPdfCpuCommand(): string
    {

        return escapeshellarg(Config::get('pdf.pdfcpu_path'));
    }

    /**
     * @throws Exception
     */
    private function addLetterhead(string $inputFile, string $letterheadFile): string
    {

        $outputFile = self::getOutputFile();

        $command = sprintf(
            '%s watermark add -mode pdf -- %s "scale:1 abs, rot:0" %s %s 2>&1',
            self::getPdfCpuCommand(),
            escapeshellarg($letterheadFile),
            escapeshellarg($inputFile),
            $outputFile
        );

        $result = Process::run($command);

        if ($result->failed()) {
            throw new Exception('Adding letterhead failed: '.$result->output());
        }

        return $outputFile;
    }

    /**
     * @throws Exception
     */
    private function addStamp(string $inputFile, string $stamp): string
    {
        $outputFile = self::getOutputFile();
        $watermarkFont = Config::get('pdf.pdfcpu_watermark_font', 'Helvetica-Bold');

        // Userfont => pdfcpu fonts install font.ttf

        $command = sprintf(
            '%s stamp add -mode text -- %s "fo:%s,points:96,scale:1 abs,op:.3" %s %s 2>&1',
            self::getPdfCpuCommand(),
            escapeshellarg($stamp),
            $watermarkFont,
            $inputFile,
            $outputFile
        );

        $result = Process::run($command);

        if ($result->failed()) {
            throw new Exception('Adding stamp failed: '.$result->output());
        }

        return $outputFile;
    }

    /**
     * @throws Exception
     */
    private function mergePdfs(array $files): string
    {
        $outputFile = self::getOutputFile();

        $escapedFiles = array_map('escapeshellarg', $files);

        $command = sprintf(
            '%s merge %s %s 2>&1',
            self::getPdfCpuCommand(),
            $outputFile,
            implode(' ', $escapedFiles)
        );

        $result = Process::run($command);

        if ($result->failed()) {
            throw new Exception('Merging PDFs failed: '.$result->output());
        }

        return $outputFile;
    }

    /**
     * @throws Exception
     */
    public function createPdf(
        string $layoutName,
        string $view,
        array $data,
        array $config = [],
        array $attachments = []
    ): string {

        $settings = app(GeneralSettings::class);

        $layout = PrintLayout::with('letterhead')->where('name', $layoutName)->first();
        $letterhead = $layout?->letterhead;

        if (! $letterhead) {
            $letterhead = Letterhead::where('is_default', true)->first();
        }

        $letterheadPdfFile = null;

        if ($letterhead) {
            $media = $letterhead->firstMedia('file');
            if ($media) {
                $letterheadPdfFile = FileHelperService::createTemporaryFileFromDoc($media->filename.'.pdf',
                    $media->contents());
            }
        }

        $defaultConfig = [
            'title' => '',
            'generator' => 'opsc.cloud',
            'hide' => false,
            'pdfA' => false,
            'saveAs' => false,
            'watermark' => '',
            'creator' => 'opsc.cloud',
        ];

        $data['config'] = array_merge($defaultConfig, $config);
        $data['pdf_footer'] = $data['config'];

        $data['styles'] = [
            'default_css' => $settings->pdf_global_css ?? '',
            'letterhead_css' => $letterhead?->css ?? '',
            'layout_css' => $layout?->css ?? '',
        ];

        $html = View::make($view, $data)->render();
        $tmpDir = FileHelperService::getTempFile('pdf');

        $pdf = new Pdf(config('pdf.weasyprint_path'));
        $pdf->generateFromHtml($html, $tmpDir);

        if ($letterheadPdfFile) {
            $tmpDir = self::addLetterhead($tmpDir, $letterheadPdfFile);
        }

        if ($data['config']['watermark']) {
            $tmpDir = self::addStamp($tmpDir, $data['config']['watermark']);
        }

        if ($attachments && count($attachments) > 0) {
            $files = [$tmpDir];

            foreach ($attachments as $attachment) {
                $document = Document::find($attachment);
                if ($document) {
                    $media = Document::find($attachment)->firstMedia('file');

                    if ($media) {
                        $attachmentFile = FileHelperService::createTemporaryFileFromDoc($media->filename,
                            $media->contents());
                        if (file_exists($attachmentFile)) {
                            $files[] = $attachmentFile;
                        }
                    }
                }
            }

            if (count($files) > 1) {
                $tmpDir = self::mergePdfs($files);
            }
        }

        if ($data['config']['pdfA']) {
            $tmpDir = self::convertToPdfA($tmpDir);
        }

        return $tmpDir;
    }
}
