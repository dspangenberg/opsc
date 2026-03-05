<?php

namespace App\Enums;

use Spatie\TypeScriptTransformer\Attributes\TypeScript;

#[TypeScript]
enum OfferStatusEnum: string
{
    case PENDING = 'pending';
    case ACCEPTED = 'accepted';
    case REJECTED = 'rejected';
    case POSTPONED = 'postponed';
    case EXTENDED = 'extended';
    case CANCELED = 'canceled';
}
