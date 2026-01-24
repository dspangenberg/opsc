<?php

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum InvoiceRecurringEnum: string
{
    case days = 'days';
    case weeks = 'weeks';
    case months = 'months';
    case years = 'years';
}
