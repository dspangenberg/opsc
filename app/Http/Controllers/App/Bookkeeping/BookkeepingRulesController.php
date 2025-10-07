<?php

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\BookkeepingAccountData;
use App\Data\BookkeepingRuleData;
use App\Data\CostCenterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\CostCenterRequest;
use App\Models\BookkeepingAccount;
use App\Models\BookkeepingBooking;
use App\Models\BookkeepingRule;
use App\Models\CostCenter;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Transaction;
use Inertia\Inertia;

    class BookkeepingRulesController extends Controller
{
    public function index()
    {
        $rules = BookkeepingRule::query()
            ->withCount('conditions')
            ->withCount('actions')
            ->orderBy('name')
            ->paginate();

        return Inertia::render('App/Bookkeeping/Rule/BookkeepingRuleIndex', [
            'rules' => BookkeepingRuleData::collect($rules),
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

    protected function getFields ($table) {
        $fields = null;
        switch ($table) {
            case 'transactions':
                $fields = Transaction::getModel()->getFillable();
                break;
            case 'receipts':
                $fields = Receipt::getModel()->getFillable();
                break;
            case 'payments':
                $fields = Payment::getModel()->getFillable();
                break;
            case 'bookings':
                $fields = BookkeepingBooking::getModel()->getFillable();
                break;
        }
        return $fields;
    }
    public function edit(BookkeepingRule $rule) {

        $rule->load('conditions', 'actions');
        return Inertia::modal('App/Bookkeeping/Rule/BookkeepingRuleEdit', [
            'rule' => BookkeepingRuleData::from($rule),
            'fields' => $this->getFields($rule->table),
        ])->baseRoute('app.bookkeeping.rules.index');
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
