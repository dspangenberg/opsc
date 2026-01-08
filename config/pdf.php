<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Ghostscript Binary Path
    |--------------------------------------------------------------------------
    |
    | Path to the Ghostscript binary. This is required for PDF to image
    | conversion. Common paths:
    | - Linux: /usr/bin/gs
    | - macOS (Homebrew): /opt/homebrew/bin/gs or /usr/local/bin/gs
    |
    | If not set in .env, will auto-detect common paths.
    |
    */
    'terms_document_id' => env('PDF_TERMS_DOCUMENT_ID'),
    'weasyprint_path' => env('PDF_WEASYPRINT_PATH'),
    'pdfcpu_path' => env('PDF_PDFCPU_PATH'),
    'pdfcpu_watermark_font' => env('PDF_PDFCPU_WATERMARK_FONT', 'Helvetica-Bold'),
    'ghostscript_path' => env('PDF_GHOSTSCRIPT_PATH') ?: (function () {
        $paths = [
            '/usr/bin/gs',              // Linux standard
            '/opt/homebrew/bin/gs',     // macOS Apple Silicon
            '/usr/local/bin/gs',        // macOS Intel
        ];

        foreach ($paths as $path) {
            if (file_exists($path)) {
                return $path;
            }
        }

        return 'gs'; // Fallback to system PATH
    })(),

];
