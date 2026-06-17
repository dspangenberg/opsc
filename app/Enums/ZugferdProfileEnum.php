<?php

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum ZugferdProfileEnum: string
{
    case ZUGFERD = 'zugferd';
    case XRECHNUNG = 'xrechnung3';

    public static function labels(): array
    {
        return [
            'zugferd' => 'EN16931 (COMFORT)',
            'xrechnung3' => 'XRechnung 3',
        ];
    }
}
