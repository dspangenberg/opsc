<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;

class ExistsIfNotEmpty implements ValidationRule
{
    public function __construct(
        private string $table,
        private string $column = 'id'
    ) {}

    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // Wenn Wert leer ist, nicht validieren
        if (empty($value) && $value !== '0') {
            return;
        }

        // Prüfen ob Wert in Tabelle existiert
        $exists = DB::table($this->table)
            ->where($this->column, $value)
            ->exists();

        if (!$exists) {
            $fail("Der gewählte Wert für :attribute ist ungültig.");
        }
    }
}
