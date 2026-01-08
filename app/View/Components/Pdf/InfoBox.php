<?php

namespace App\View\Components\Pdf;

use Closure;
use DateTime;
use Illuminate\Contracts\View\View;
use Illuminate\View\Component;

class InfoBox extends Component
{
    /**
     * Create a new component instance.
     */
    public function __construct(
        public string $issuedOn,
        public ?string $dueDate,
        public ?string $reference,
        public ?string $accountId,
        public ?string $referenceLabel,
        public ?string $servicePeriodBegin,
        public ?string $servicePeriodEnd,
    ) {}

    /**
     * Get the view / contents that represent the component.
     */
    public function render(): View|Closure|string
    {
        return view('components.pdf.info-box');
    }
}
