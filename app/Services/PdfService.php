<?php

namespace App\Services;

use App\Facades\FileHelperService;
use App\Models\Document;
use App\Models\Letterhead;
use App\Models\PrintLayout;
use App\Settings\GeneralSettings;
use Exception;
use Illuminate\Support\Facades\View;
use Mpdf\Mpdf;
use Mpdf\WatermarkText;
use Pontedilana\PhpWeasyPrint\Pdf;

class PdfService
{
    public static function fixPdfForPdfA(string $pdfPath): void
    {
        $content = file_get_contents($pdfPath);
        if ($content === false || ! str_contains($content, '/Interpolate true')) {
            return;
        }

        $content = str_replace('/Interpolate true', '/Interpolate false', $content);

        preg_match_all('/^(\d+) \d+ obj/m', $content, $objMatches, PREG_SET_ORDER | PREG_OFFSET_CAPTURE);
        $maxObj = 0;
        $entries = [0 => sprintf("%010d %05d f \r\n", 0, 65535)];
        foreach ($objMatches as $m) {
            $num = (int) $m[1][0];
            $entries[$num] = sprintf("%010d %05d n \r\n", $m[0][1], 0);
            $maxObj = max($maxObj, $num);
        }

        $size = $maxObj + 1;
        $xref = "xref\r\n0 {$size}\r\n";
        for ($i = 0; $i < $size; $i++) {
            $xref .= $entries[$i] ?? sprintf("%010d %05d f \r\n", 0, 65535);
        }

        preg_match('/trailer\s*(<<.*?>>)/s', $content, $trailerMatch);
        $trailer = $trailerMatch[1] ?? '';
        $content = preg_replace('/xref\r?\n.*?%%EOF/s', '', $content);

        $xrefPos = strlen(rtrim($content)) + 2;
        $content = rtrim($content)."\r\n{$xref}trailer\r\n{$trailer}\r\nstartxref\r\n{$xrefPos}\r\n%%EOF";
        file_put_contents($pdfPath, $content);
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
        $pdf->setOptions([
            'uncompressed-pdf' => true,
        ]);
        $pdf->generateFromHtml($html, $tmpDir);

        $mpdf = new Mpdf;

        if ($letterheadPdfFile) {
            $mpdf->SetDocTemplate($letterheadPdfFile, true);
        }

        if ($data['config']['watermark']) {
            $mpdf->watermark_font = true; // // true führt offenbar dazu, dass Facit, also der Standardfont (?) genutzt wird
            $mpdf->showWatermarkText = true;
            $mpdf->SetWatermarkText(new WatermarkText($config['watermark']));
        }

        $pagecount = $mpdf->setSourceFile($tmpDir);
        for ($i = 1; $i <= $pagecount; $i++) {
            $tplIdx = $mpdf->ImportPage($i);
            $mpdf->useTemplate($tplIdx);
            if ($i < $pagecount) {
                $mpdf->AddPage();
            }
        }

        if ($attachments && count($attachments) > 0) {
            $files = [];

            foreach ($attachments as $attachment) {
                if (is_string($attachment)) {
                    $files[] = $attachment;
                } else {
                    $document = Document::find($attachment);
                    if ($document) {
                        $media = $document->firstMedia('file');

                        if ($media) {
                            $attachmentFile = FileHelperService::createTemporaryFileFromDoc($media->filename,
                                $media->contents());
                            if (file_exists($attachmentFile)) {
                                $files[] = $attachmentFile;
                            }
                        }
                    }
                }
            }

            if (count($files) > 0) {
                foreach ($files as $file) {
                    $mpdf->AddPage();
                    $pagecount = $mpdf->setSourceFile($file);
                    for ($i = 1; $i <= $pagecount; $i++) {
                        $tplIdx = $mpdf->ImportPage($i);
                        $mpdf->useTemplate($tplIdx);
                        if ($i < $pagecount) {
                            $mpdf->AddPage();
                        }
                    }
                }
            }
        }

        if ($data['config']['pdfA']) {
            $mpdf->PDFA = true;
        }

        $mpdf->Output($tmpDir);

        return $tmpDir;
    }
}
