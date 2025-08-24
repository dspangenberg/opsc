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

class TransactionMoneyMoneyImportController extends Controller
{
    public function __invoke(MoneyMoneyImportRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        // Store the uploaded file temporarily
        $uploadedFile = $request->file('file');
        $tempFilePath = $uploadedFile->store('temp');
        $fullPath = storage_path('app/'.$tempFilePath);


        try {
            // Process the MoneyMoney JSON file
            // MoneyMoneyTransaction::setFilename($fullPath, $validatedData['bank_account_id']);

            // Get the processed transactions
            // $transactions = MoneyMoneyTransaction::all();

            // TODO: Save transactions to database or process them further
            // For now, we'll just redirect back with success message

            // Clean up temporary file
            unlink($fullPath);


        } catch (\Exception $e) {
            // Clean up temporary file on error
            if (file_exists($fullPath)) {
                unlink($fullPath);
            }

            return redirect()->back()->with('error', 'Error importing file: '.$e->getMessage());
        }
    }
}
