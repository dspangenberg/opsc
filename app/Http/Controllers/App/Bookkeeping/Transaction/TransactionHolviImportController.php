<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Http\Controllers\App\Bookkeeping\Transaction;

use App\Facades\BookeepingRuleService;
use App\Http\Controllers\Controller;
use App\Http\Requests\HolviImportRequest;
use App\Models\Transaction;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use App\Facades\MoneyMoneyService;
use League\Csv\Exception;
use League\Csv\Reader;
use League\Csv\SyntaxError;
use League\Csv\UnavailableStream;

class TransactionHolviImportController extends Controller
{
    /**
     * @throws UnavailableStream
     * @throws SyntaxError
     * @throws Exception
     */
    public function __invoke(HolviImportRequest $request): RedirectResponse
    {
        $validatedData = $request->validated();

        // Store the uploaded file temporarily
        $uploadedFile = $request->file('file');
        $tempFilePath = $uploadedFile->store('temp');
        $fullPath = storage_path('app/'.$tempFilePath);

        $csv = Reader::createFromPath($fullPath, 'r');
        $csv->setHeaderOffset(null); // No header
        $counter = 0;
        $ids = [];
        foreach ($csv->getRecords() as $record) {
            if ($counter > 0) {
                $transaction = Transaction::firstOrNew(['mm_ref' => $record[8]]);
                if (!$transaction->is_locked) {
                    $transaction->mm_ref = $record[8];
                    $transaction->bank_account_id = $validatedData['bank_account_id'];
                    $transaction->valued_on = Carbon::createFromLocaleFormat('d.m.Y', 'de', $record[0],
                        'Europe/Berlin');
                    $transaction->booked_on = Carbon::createFromLocaleFormat('d.m.Y', 'de', $record[1],
                        'Europe/Berlin');


                    // Deutsches Zahlenformat konvertieren: "1.234,56" -> 1234.56
                    $transaction->amount = (float) str_replace(',', '.', str_replace('.', '', $record[2]));
                    $transaction->booking_text = $transaction->amount > 0 ? 'Gutschrift' : 'Zahlung';



                    $transaction->currency = $record[3];
                    $transaction->name = strtoupper($record[4]);

                    $purpose1 = $record[7];
                    $purpose2 = $record[7] !== $record[5] ? '|' .$record[5] : '';

                    $transaction->purpose = $purpose1 . $purpose2;
                    $transaction->save();
                    $transaction->getContact();
                    $ids[] = $transaction->id;
                }
            }
        $counter++;
        }

        BookeepingRuleService::run('transactions', new Transaction, $ids);

        unlink($fullPath);

        return redirect()->route('app.bookkeeping.transactions.index');
    }

}
