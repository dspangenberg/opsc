<?php

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\BookkeepingAccountData;
use App\Data\CostCenterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\CostCenterRequest;
use App\Models\BookkeepingAccount;
use App\Models\CostCenter;
use Inertia\Inertia;

class BookkeepingAcountsController extends Controller
{
    public function index()
    {
        $accounts = BookkeepingAccount::query()->with('tax')->orderBy('name')->paginate();
        return Inertia::render('App/Bookkeeping/BookkeepingAccount/BookkeepingAccountIndex', [
            'accounts' => BookkeepingAccountData::collect($accounts),
        ]);
    }

    public function create() {
        $accounts = BookkeepingAccount::query()->orderBy('account_number')->get();
        $cost_center = new CostCenter();
        return Inertia::modal('App/Bookkeeping/CostCenter/CostCenterEdit', [
            'cost_center' => CostCenterData::from($cost_center),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($accounts),
        ])->baseRoute('app.bookkeeping.cost-centers.index');
    }

    public function edit(CostCenter $costCenter) {
        $accounts = BookkeepingAccount::query()->orderBy('account_number')->get();
        $costCenter->load('account');
        return Inertia::modal('App/Bookkeeping/CostCenter/CostCenterEdit', [
            'cost_center' => CostCenterData::from($costCenter),
            'bookkeeping_accounts' => BookkeepingAccountData::collect($accounts),
        ])->baseRoute('app.bookkeeping.cost-centers.index');
    }

    public function update(CostCenterRequest $request, CostCenter $costCenter) {
        $costCenter->update($request->validated());
        return redirect()->route('app.bookkeeping.cost-centers.index');
    }

    public function store(CostCenterRequest $request) {
        CostCenter::create($request->validated());
        return redirect()->route('app.bookkeeping.cost-centers.index');
    }
}
