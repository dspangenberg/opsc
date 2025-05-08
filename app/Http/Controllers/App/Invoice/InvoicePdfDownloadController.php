<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Support\Facades\Storage;


class InvoicePdfDownloadController extends Controller
{
    public function __invoke(int $id)
    {

        $invoice = Invoice::find($id);
        $prefix = tenant('id');


        $file = '/Invoicing/Invoices/'.$invoice->issued_on->format('Y').'/'.$invoice->filename;

        if (Storage::disk('s3')->missing($file)) {
            dump($file.' nicht gefunden');
        }

//        return response()->download($file, $invoice->filename);

        return Storage::disk('s3')->download($file, $invoice->filename);
    }
}
