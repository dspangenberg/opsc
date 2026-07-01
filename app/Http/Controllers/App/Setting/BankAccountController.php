<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\BankAccountData;
use App\Data\BookkeepingAccountData;
use App\Http\Controllers\Controller;
use App\Http\Requests\BankAccountRequest;
use App\Models\BankAccount;
use App\Models\BookkeepingAccount;
use Inertia\Inertia;

class BankAccountController extends Controller
{
    public function index()
    {
        $bankAccounts = BankAccount::query()->orderBy('name')->paginate();

        return Inertia::render('App/Setting/BankAccount/BankAccountIndex', [
            'bank_accounts' => BankAccountData::collect($bankAccounts),
        ]);
    }

    public function create()
    {
        $bank_account = new BankAccount;
        $bookkeeping_accounts = BookkeepingAccount::query()->orderBy('account_number')->get();

        return Inertia::render('App/Setting/DocumentType/DocumentTypeEdit', [
            'bank_account' => BankAccountData::from($bank_account),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($bookkeeping_accounts),
        ]);
    }

    public function edit(BankAccount $bank_account)
    {
        $bookkeeping_accounts = BookkeepingAccount::query()->orderBy('account_number')->get();

        return Inertia::render('App/Setting/BankAccount/BankAccountEdit', [
            'bank_account' => BankAccountData::from($bank_account),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($bookkeeping_accounts),
        ]);
    }

    public function update(BankAccountRequest $request, BankAccount $bank_account)
    {
        $bank_account->update($request->validated());

        return redirect()->route('app.bookkeeping.bank-account.index');
    }

    public function store(BankAccountRequest $request)
    {
        BankAccount::create($request->validated());

        return redirect()->route('app.bookkeeping.bank-account.index');
    }
}
