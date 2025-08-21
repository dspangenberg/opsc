<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Mpdf\Config\FontVariables;
use Mpdf\Mpdf;
use Mpdf\MpdfException;
use Mpdf\WatermarkText;
use Spatie\TemporaryDirectory\Exceptions\PathAlreadyExists;
use Spatie\TemporaryDirectory\TemporaryDirectory;

class PdfService
{
    /**
     * @throws PathAlreadyExists
     */

    /**
     * @throws MpdfException|PathAlreadyExists
     */
    public static function createPdf(string $layoutName, string $view, array $data, array $config = []): string
    {

        $layouts = Storage::disk('system')->json('layouts/layouts.json');
        $letterheads = Storage::disk('system')->json('letterheads/letterheads.json');
        $fonts = Storage::disk('system')->json('fonts/fonts.json');

        $layoutsCollection = collect($layouts['layouts']);
        $letterheadsCollection = collect($letterheads['letterheads']);

        $layout = $layoutsCollection->where('name', $layoutName)->first();
        $letterhead = $letterheadsCollection->where('name', $layout['letterhead'])->first();

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

        $customFontData = [];
        foreach ($fonts['fonts'] as $value) {
            $customFontData[$value['alias']] = $value['filenames'];
        }

        $tmpDir = storage_path('system/tmp');

        $defaultFontConfig = (new FontVariables)->getDefaults();
        $fontData = $defaultFontConfig['fontdata'];

        $mpdf = new Mpdf([
            'tempDir' => $tmpDir,
            'fontdata' => $fontData + $customFontData,
            'shrink_tables_to_fit' => 0,
        ]);

        $mpdf->SHYlang = 'de';

        $temporaryDirectory = (new TemporaryDirectory)
            ->create();

        $pdfFile = $temporaryDirectory->path(Str::random(16).'.pdf');

        $mpdf->AddFontDirectory(storage_path('system/fonts'));
        $mpdf->SetDocTemplate($letterheadPdfFile, true);

        if ($data['pdf_config']['watermark']) {
            $mpdf->SetWatermarkText(new WatermarkText($config['watermark']));
            $mpdf->showWatermarkText = true;
        }

        $mpdf->WriteHTML($html);
        $mpdf->SetTitle($data['pdf_footer']['title']);
        $mpdf->SetCreator('opsc.cloud');


        if ($data['pdf_config']['pdfA']) {
            $mpdf->PDFA = true;
        }

        if ($data['pdf_config']['saveAs']) {
            $mpdf->Output($data['pdf_config']['saveAs'], 'F');
        }

        $mpdf->Output($pdfFile, 'F');

        return $pdfFile;
    }
}
