<?php

namespace App\Services;

use App\Models\Document;
use App\Facades\FileHelperService;
use Exception;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Pontedilana\PhpWeasyPrint\Pdf;
use Spatie\TemporaryDirectory\Exceptions\PathAlreadyExists;
use Spatie\TemporaryDirectory\TemporaryDirectory;

class WeasyPdfService
{
    /**
     * @throws Exception
     */
    public static function createPdf(
        string $layoutName,
        string $view,
        array $data,
        array $config = [],
        array $attachments = []
    ): string {
        $systemDisk = Storage::disk('system');

        // Kompaktes Debug-Logging
        Log::info('PdfService Debug Info:', [
            'requested_layout' => $layoutName,
            'system_disk_path' => $systemDisk->path(''),
            'json_files_exist' => [
                'layouts.json' => $systemDisk->exists('layouts/layouts.json'),
                'letterheads.json' => $systemDisk->exists('letterheads/letterheads.json'),
                'fonts.json' => $systemDisk->exists('fonts/fonts.json')
            ],
            'json_file_paths' => [
                'layouts' => $systemDisk->path('layouts/layouts.json'),
                'letterheads' => $systemDisk->path('letterheads/letterheads.json'),
                'fonts' => $systemDisk->path('fonts/fonts.json')
            ]
        ]);


        $layouts = Storage::disk('system')->json('layouts/layouts.json');
        $letterheads = Storage::disk('system')->json('letterheads/letterheads.json');

        // Null-Checks für JSON-Dateien
        if (!$layouts || !isset($layouts['layouts'])) {
            throw new Exception('Layout-Konfiguration konnte nicht geladen werden oder ist ungültig.');
        }

        if (!$letterheads || !isset($letterheads['letterheads'])) {
            throw new Exception('Letterhead-Konfiguration konnte nicht geladen werden oder ist ungültig.');
        }

        // Collections erst NACH den Null-Checks erstellen
        $layoutsCollection = collect($layouts['layouts']);
        $letterheadsCollection = collect($letterheads['letterheads']);

        $layout = $layoutsCollection->where('name', $layoutName)->first();

        if (!$layout) {
            throw new Exception("Layout '$layoutName' wurde nicht gefunden.");
        }

        if (!isset($layout['letterhead'])) {
            throw new Exception("Layout '$layoutName' hat keine Letterhead-Konfiguration.");
        }

        $letterhead = $letterheadsCollection->where('name', $layout['letterhead'])->first();

        if (!$letterhead) {
            throw new Exception("Letterhead '{$layout['letterhead']}' wurde nicht gefunden.");
        }

        // Sicherstellen, dass erforderliche Felder vorhanden sind
        if (!isset($layout['css-file'])) {
            throw new Exception("Layout $layoutName hat keine CSS-Datei konfiguriert.");
        }

        if (!isset($letterhead['css-file']) || !isset($letterhead['pdf-file'])) {
            throw new Exception("Letterhead '{$layout['letterhead']}' hat keine CSS- oder PDF-Datei konfiguriert.");
        }

        $defaultLayoutCss = Storage::disk('system')->get('layouts/default.css');
        $layoutCss = Storage::disk('system')->get('layouts/'.$layout['css-file']);

        $defaultLetterheadCss = Storage::disk('system')->get('letterheads/default.css');
        $letterheadCss = Storage::disk('system')->get('letterheads/'.$letterhead['css-file']);
        $letterheadPdfFile = storage_path('system/letterheads/'.$letterhead['pdf-file']);

        $styles = [
            'layout_default_css' => $defaultLayoutCss,
            'layout_css' => $layoutCss,
            'letterhead_default_css' => $defaultLetterheadCss,
            'letterhead_css' => $letterheadCss,
        ];

        $defaultConfig = [
            'title' => '',
            'hide' => false,
            'pdfA' => false,
            'saveAs' => false,
            'watermark' => ''
        ];

        $data['pdf_footer'] = array_merge($defaultConfig, $config);
        $data['pdf_config'] = array_merge($defaultConfig, $config);
        $data['styles'] = $styles;

        $html = View::make($view, $data)->render();
        $tmpDir = storage_path('system/tmp').'/'.Str::random().'.pdf';

        /*

        if ($data['pdf_config']['watermark']) {
            $mpdf->SetWatermarkText(new WatermarkText($config['watermark']));
            $mpdf->showWatermarkText = true;
            $mpdf->watermark_font = 'Facit';
        }

        $mpdf->list_marker_offset = '5.5pt';
        $mpdf->list_symbol_size = '3.6pt';

        $mpdf->WriteHTML($html);
        $mpdf->SetTitle($data['pdf_footer']['title']);
        $mpdf->SetCreator('opsc.cloud');

        if ($data['pdf_config']['pdfA']) {
            $mpdf->PDFA = true;
        }

        */


        $pdf = new Pdf(config('pdf.weasyprint_path'));
        $pdf->generateFromHtml($html, $tmpDir);

        $pdf = new \mikehaertl\pdftk\Pdf($tmpDir, ['command' => config('pdf.pdftk_path')]);

        $result = $pdf->multiBackground($letterheadPdfFile)->saveAs($tmpDir);

        if ($result === false) {
            throw new Exception($pdf->getError());
        }

        /*
        $pdf = new \mikehaertl\pdftk\Pdf($tmpDir, ['command' => config('pdf.pdftk_path')]);
        $pdf->stamp('/Users/dspangenberg/Downloads/entwurf.pdf')->saveAs($tmpDir);
        */

        if ($attachments && count($attachments) > 0) {
            $pdf = new \mikehaertl\pdftk\Pdf($tmpDir, ['command' => config('pdf.pdftk_path')]);
            foreach ($attachments as $attachment) {
                $media = Document::find($attachment)->firstMedia('file');

                if ($media) {
                    $attachmentFile = FileHelperService::createTemporaryFileFromDoc($media->filename,
                        $media->contents());
                    if (file_exists($attachmentFile)) {
                        $pdf->addFile($attachmentFile);
                    }
                }
            }
            $pdf->saveAs($tmpDir);
        }

        return $tmpDir;
    }
}
