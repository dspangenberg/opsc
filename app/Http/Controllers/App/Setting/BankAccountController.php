<?php

namespace App\Http\Controllers\App\Setting;

use App\Data\BankAccountData;
use App\Data\BookkeepingAccountData;
use App\Http\Controllers\Controller;
use App\Http\Requests\BankAccountRequest;
use App\Models\BankAccount;
use App\Models\BookkeepingAccount;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Throwable;

class BankAccountController extends Controller
{
    public function index(): Response
    {
        $bankAccounts = BankAccount::query()->orderBy('name')->paginate();

        return Inertia::render('App/Setting/BankAccount/BankAccountIndex', [
            'bank_accounts' => BankAccountData::collect($bankAccounts),
        ]);
    }

    public function create(): Response
    {
        $bank_account = new BankAccount;
        $bookkeeping_accounts = BookkeepingAccount::query()->orderBy('account_number')->get();

        return Inertia::render('App/Setting/BankAccount/BankAccountEdit', [
            'bank_account' => BankAccountData::from($bank_account),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($bookkeeping_accounts),
        ]);
    }

    public function edit(BankAccount $bank_account): Response
    {
        $bookkeeping_accounts = BookkeepingAccount::query()->orderBy('account_number')->get();

        return Inertia::render('App/Setting/BankAccount/BankAccountEdit', [
            'bank_account' => BankAccountData::from($bank_account),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($bookkeeping_accounts),
        ]);
    }

    /**
     * @throws Throwable
     */
    public function setDefault(BankAccount $bank_account): RedirectResponse
    {
        DB::transaction(function () use ($bank_account) {
            BankAccount::query()->update(['is_default' => false]);
            $bank_account->is_default = true;
            $bank_account->save();
        });
        return redirect()->route('app.bookkeeping.bank-account.index');
    }

    public function destroy(BankAccount $bank_account): RedirectResponse
    {
        if ($bank_account->is_default) {
            Inertia::flash('toast', [
                'type' => 'error',
                'message' => 'Das Standardkonto kann nicht gelöscht werden.'
            ]);


            return redirect()
                ->route('app.bookkeeping.bank-account.index');
        }

        $bank_account->delete();

        return redirect()->route('app.bookkeeping.bank-account.index');
    }

    public function update(BankAccountRequest $request, BankAccount $bank_account): RedirectResponse
    {
        $bank_account->update($request->validated());

        return redirect()->route('app.bookkeeping.bank-account.index');
    }

    public function store(BankAccountRequest $request): RedirectResponse
    {
        $bankAccount = BankAccount::create($request->validated());
        if (BankAccount::query()->count() == 1) {
            $bankAccount->is_default = true;
            $bankAccount->save();
        }

        return redirect()->route('app.bookkeeping.bank-account.index');
    }
}
