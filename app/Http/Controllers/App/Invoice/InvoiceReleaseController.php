<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Invoice;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Mpdf\MpdfException;
use Spatie\TemporaryDirectory\Exceptions\PathAlreadyExists;

class InvoiceReleaseController extends Controller
{
    /**
     * @throws MpdfException
     * @throws PathAlreadyExists
     */
    public function __invoke(Invoice $invoice)
    {
        $invoice->release();

        return redirect()->route('app.invoice.details', ['invoice' => $invoice->id]);
    }
}
