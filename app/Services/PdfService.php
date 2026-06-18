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

        $weasyprint = new Pdf(config('pdf.weasyprint_path'));
        $weasyprint->setOptions([
            'uncompressed-pdf' => true,
        ]);
        $weasyprint->generateFromHtml($html, $tmpDir);

        $mpdf = new Mpdf;

        if ($letterheadPdfFile) {
            $mpdf->SetDocTemplate($letterheadPdfFile, true);
        }

        if ($data['config']['watermark']) {
            $mpdf->watermark_font = true; // // true führt offenbar dazu, dass Facit, also der (body-) Standardfont (?) genutzt wird
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
