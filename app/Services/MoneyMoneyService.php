<?php

namespace App\Services;

use App\Facades\BookeepingRuleService;
use App\Models\BankAccount;
use App\Models\NumberRange;
use App\Models\Transaction;
use App\SushiModels\MoneyMoneyTransaction;

class MoneyMoneyService
{
    public function __construct() {}

    public function importJsonFile(string $file): void
    {
        $fileContent = file_get_contents($file);
        $account = json_decode($fileContent)->account;

        $bankAccount = BankAccount::query()->where('iban', $account->iban)->first();
        if (! $bankAccount) {
            $bankAccount = BankAccount::query()->where('name', $account->name)->first();
        }

        $transactionIds = [];

        MoneyMoneyTransaction::setFilename($file, $bankAccount->id);
        $ownBankAccounts = BankAccount::get()->pluck('iban')->toArray();
        $transactions = MoneyMoneyTransaction::orderBy('booked_on', 'asc')->get();

        $transactions->each(function ($item) use ($bankAccount) {
            $item->bank_account_id = $bankAccount->id;

            if ($item->booking_text !== 'Currency conversion') {
                $item->save();
                $transactionIds[] = $item->id;
                $transaction = Transaction::firstOrNew(['mm_ref' => 'mm-'.$item->mm_ref]);
                if (! $transaction->is_locked) {

                    $transaction->is_transit = false;
                    $transaction->is_private = false;
                    $transaction->counter_account_id = 0;
                    $transaction->fill($item->toArray());
                    $transaction->mm_ref = 'mm-'.$item->mm_ref;

                    /*
                    if (! $transaction->number_range_document_numbers_id) {
                        $transaction->number_range_document_numbers_id = NumberRange::createDocumentNumber($transaction, 'booked_on', $bankAccount->prefix);
                    }
                    */

                    if ($bankAccount->bank_code === 'PP' && $transaction->currency !== 'EUR') {
                        $conversionRecords = MoneyMoneyTransaction::where('booking_text',
                            'Currency conversion')->where('booked_on', $transaction->booked_on->format('Y-m-d'))->get();
                        if ($conversionRecords->count() === 2) {
                            $conversion = $conversionRecords->where('currency', 'EUR')->first();

                            if ($conversion) {
                                $transaction->foreign_currency = $item->currency;
                                $transaction->amount_in_foreign_currency = $transaction->amount;
                                $transaction->currency = 'EUR';
                                $transaction->amount = $conversion->amount;
                            }

                        }
                    }

                    if (! $transaction->counter_account_id) {
                        $transaction->getContact();
                    }

                    $transaction->save();
                }
            }
        });

        BookeepingRuleService::run('transactions', new Transaction, $transactionIds);
    }
}
