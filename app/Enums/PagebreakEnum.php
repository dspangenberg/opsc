<?php

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum PagebreakEnum: string
{
    case AFTER = 'after';
    case BEFORE = 'before';
    case BOTH = 'both';
    case NONE = 'none';
}
