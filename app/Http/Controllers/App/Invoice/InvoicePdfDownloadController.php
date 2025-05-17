<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Support\Facades\Storage;
use Mpdf\MpdfException;
use Spatie\TemporaryDirectory\Exceptions\PathAlreadyExists;

class InvoicePdfDownloadController extends Controller
{
    /**
     * @throws MpdfException
     * @throws PathAlreadyExists
     */
    public function __invoke(Invoice $invoice): \Symfony\Component\HttpFoundation\BinaryFileResponse
    {
        $file = '/Invoicing/Invoices/'.$invoice->issued_on->format('Y').'/'.$invoice->filename;

        $pdfFile = Invoice::createOrGetPdf($invoice, false);

        return response()->file($pdfFile);

        if (Storage::disk('s3')->exists($file)) {
            return Storage::disk('s3')->download($file, $invoice->filename);
        }

        abort(404);
    }
}
