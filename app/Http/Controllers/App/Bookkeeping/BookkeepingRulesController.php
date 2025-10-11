<?php

namespace App\Http\Controllers\App\Bookkeeping;

use App\Data\BookkeepingAccountData;
use App\Data\BookkeepingRuleData;
use App\Data\CostCenterData;
use App\Http\Controllers\Controller;
use App\Http\Requests\BookkeepingRuleStoreRequest;
use App\Http\Requests\BookkeepingRuleUpdateRequest;
use App\Http\Requests\CostCenterRequest;
use App\Models\BookkeepingAccount;
use App\Models\BookkeepingBooking;
use App\Models\BookkeepingRule;
use App\Models\BookkeepingRuleAction;
use App\Models\BookkeepingRuleCondition;
use App\Models\CostCenter;
use App\Models\Payment;
use App\Models\Receipt;
use App\Models\Transaction;
use Inertia\Inertia;

    class BookkeepingRulesController extends Controller
{
        public function getFields(String $table)
        {


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

    public function edit(BookkeepingRule $rule) {

        $rule->load('conditions', 'actions');
        return Inertia::modal('App/Bookkeeping/Rule/BookkeepingRuleEdit', [
            'rule' => BookkeepingRuleData::from($rule),
            'fields' => $this->getFields($rule->table),
        ])->baseRoute('app.bookkeeping.rules.index');
    }

    public function update(BookkeepingRuleUpdateRequest $request, BookkeepingRule $rule) {

        $ruleData = $request->except(['conditions','actions']);
        $rule->update($ruleData);
        if ($request->has('conditions')) {
            $this->updateRuleConditions($rule, $request->input('conditions', []));
        }
        if ($request->has('actions')) {
            $this->updateRuleActions($rule, $request->input('actions', []));
        }
        return redirect()->route('app.bookkeeping.rules.index');
    }

    public function destroy(BookkeepingRule $rule) {
        $rule->conditions()->delete();
        $rule->actions()->delete();
        $rule->delete();
        return redirect()->route('app.bookkeeping.rules.index');
    }

        public function create() {
            $rule = new BookkeepingRule();
            return Inertia::modal('App/Bookkeeping/Rule/BookkeepingRuleCreate', [
                'rule' => BookkeepingRuleData::from($rule),
            ])->baseRoute('app.bookkeeping.rules.index');
        }


        public function store(BookkeepingRuleStoreRequest $request) {
        $rule = BookkeepingRule::create($request->validated());
        return redirect()->route('app.bookkeeping.rules.edit', ['rule' => $rule]);
    }

        private function updateRuleConditions(BookkeepingRule $rule, array $conditionsData): void
        {
            // Sammle alle IDs aus den eingehenden Daten
        $incomingIds = collect($conditionsData)
            ->pluck('id')
            ->filter()
            ->toArray();

        // Lösche Conditions, die nicht mehr in den Daten enthalten sind
        if (!empty($incomingIds)) {
            $rule->conditions()
                ->whereNotIn('id', $incomingIds)
                ->delete();
        } else {
            // Wenn keine IDs vorhanden sind, lösche alle bestehenden Conditions
            $rule->conditions()->delete();
        }

        // Erstelle oder aktualisiere Conditions
        foreach ($conditionsData as $index => $conditionData) {
            $conditionAttributes = [
                'bookkeeping_rule_id' => $rule->id,
                'field' => $conditionData['field'],
                'logical_condition' => $conditionData['logical_condition'] ?? null,
                'value' => $conditionData['value'] ?? $index,
            ];

            if (!empty($conditionData['id'])) {
                // Bestehende Condition aktualisieren
                BookkeepingRuleCondition::where('id', $conditionData['id'])
                    ->where('bookkeeping_rule_id', $rule->id)
                    ->update($conditionAttributes);
            } else {
                // Neue Condition erstellen
                BookkeepingRuleCondition::create($conditionAttributes);
            }
        }
    }
        private function updateRuleActions(BookkeepingRule $rule, array $actionsData): void
        {
            // Sammle alle IDs aus den eingehenden Daten
            $incomingIds = collect($actionsData)
                ->pluck('id')
                ->filter()
                ->toArray();

            // Lösche Conditions, die nicht mehr in den Daten enthalten sind
            if (!empty($incomingIds)) {
                $rule->actions()
                    ->whereNotIn('id', $incomingIds)
                    ->delete();
            } else {
                // Wenn keine IDs vorhanden sind, lösche alle bestehenden Conditions
                $rule->actions()->delete();
            }

            // Erstelle oder aktualisiere Conditions
            foreach ($actionsData as $index => $actionData) {
                $actionAttributes = [
                    'bookkeeping_rule_id' => $rule->id,
                    'field' => $actionData['field'],
                    'value' => $actionData['value'] ?? $index,
                ];

                if (!empty($actionData['id'])) {
                    // Bestehende Condition aktualisieren
                    BookkeepingRuleAction::where('id', $actionData['id'])
                        ->where('bookkeeping_rule_id', $rule->id)
                        ->update($actionAttributes);
                } else {
                    // Neue Condition erstellen
                    BookkeepingRuleAction::create($actionAttributes);
                }
            }
        }
}
