<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Http\Controllers\Controller;
use App\Http\Requests\MoneyMoneyImportRequest;
use App\SushiModels\MoneyMoneyTransaction;
use Illuminate\Http\RedirectResponse;
use App\Facades\MoneyMoneyService;
class TransactionMoneyMoneyImportController extends Controller
{
    public function __invoke(MoneyMoneyImportRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        // Store the uploaded file temporarily
        $uploadedFile = $request->file('file');
        $tempFilePath = $uploadedFile->store('temp');
        $fullPath = storage_path('app/'.$tempFilePath);

        MoneyMoneyService::importJsonFile($fullPath);
        unlink($fullPath);

        return redirect()->route('app.bookkeeping.transactions.index');
    }

}
