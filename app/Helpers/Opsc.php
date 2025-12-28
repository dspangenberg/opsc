<?php

if (!function_exists('minutes_to_hours')) {
    function minutes_to_hours($minutes): string
    {
        $is_neg = ($minutes < 0);
        if ($is_neg) {
            $minutes = $minutes * -1;
        }
        $hours = floor($minutes / 60);
        $minutes = $minutes - ($hours * 60);

        return (($is_neg) ? '-' : '').$hours.':'.substr('00'.$minutes, -2, 2);
    }
}

if (!function_exists('minutes_to_units')) {
    function minutes_to_units($minutes): string
    {
        $quarters = ceil($minutes / 15) * 15;
        $mins = $quarters / 60;

        return number_format($mins, 2, ',', '.');
    }
}

if (!function_exists('md')) {
    /**
     * @throws CommonMarkException
     */
    function md($markdown): string
    {
        return Str::inlineMarkdown($markdown);
    }
}

if (!function_exists('formated_invoice_id')) {
    function formated_invoice_id(int $invoice_id): string
    {
        if (! $invoice_id) {
            return '(Entwurf)';
        }

        $formated_id = substr($invoice_id, 0, 4).'.';
        $formated_id .= substr($invoice_id, 4, 1).'.';
        if (strlen($invoice_id) == 8) {
            $formated_id .= substr($invoice_id, 5);
        } else {
            $formated_id .= substr($invoice_id, 5, 1).'.';
            $formated_id .= substr($invoice_id, 6);

        }

        return $formated_id;
    }
}

if (!function_exists('formated_offer_id')) {
    function formated_offer_id(int $invoice_id): string
    {
        if (! $invoice_id) {
            return '(Entwurf)';
        }

        $formated_id = substr($invoice_id, 0, 4).'.';
        $formated_id .= substr($invoice_id, 4, 1).'.';
        if (strlen($invoice_id) == 8) {
            $formated_id .= substr($invoice_id, 5);
        } else {
            $formated_id .= substr($invoice_id, 5, 1).'.';
            $formated_id .= substr($invoice_id, 6);

        }

        return $formated_id;
    }
}

if (!function_exists('iban_to_human_format')) {
    function iban_to_human_format($iban)
    {
        // First verify validity, or return

        // Add spaces every four characters
        $human_iban = '';
        for ($i = 0; $i < strlen($iban); $i++) {
            $human_iban .= substr($iban, $i, 1);
            if (($i > 0) && (($i + 1) % 4 == 0)) {
                $human_iban .= ' ';
            }
        }

        return $human_iban;
    }
}

if (!function_exists('sortByLength')) {
    // https://stackoverflow.com/questions/838227/php-sort-an-array-by-the-length-of-its-values
    function sortByLength($a, $b): int
    {
        return strlen($b) - strlen($a);
    }
}
