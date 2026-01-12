<?php

use League\CommonMark\Environment\Environment;
use League\CommonMark\Exception\CommonMarkException;
use League\CommonMark\Extension\CommonMark\CommonMarkCoreExtension;
use League\CommonMark\Extension\Table\TableExtension;
use League\CommonMark\MarkdownConverter;

if (! function_exists('minutes_to_hours')) {
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

if (! function_exists('minutes_to_units')) {
    function minutes_to_units($minutes): string
    {
        $quarters = ceil($minutes / 15) * 15;
        $mins = $quarters / 60;

        return number_format($mins, 2, ',', '.');
    }
}

if (! function_exists('md')) {
    /**
     * Converts markdown to sanitized HTML to prevent XSS attacks.
     * Uses league/commonmark with CommonMark and Table extensions.
     * Allows safe HTML tags via HTMLPurifier configuration.
     * @throws CommonMarkException
     */
    function md(?string $markdown): string
    {
        if (empty($markdown)) {
            return '';
        }

        $config = [
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
        ];

        $environment = new Environment($config);
        $environment->addExtension(new CommonMarkCoreExtension);
        $environment->addExtension(new TableExtension);

        $converter = new MarkdownConverter($environment);
        $html = $converter->convert($markdown)->getContent();

        // Sanitize HTML output using HTMLPurifier to allow safe tags only
        $purifierConfig = HTMLPurifier_Config::createDefault();
        $purifierConfig->set('HTML.Allowed', 'p,br,strong,em,u,h1,h2,h3,h4,h5,h6,ul,ol,li,a[href],table,thead,tbody,tr,th,td,span,div,blockquote,code,pre');
        $purifierConfig->set('URI.DisableExternalResources', true);
        $purifierConfig->set('URI.DisableResources', true);
        $purifier = new HTMLPurifier($purifierConfig);

        return $purifier->purify($html);
    }
}

if (! function_exists('formated_invoice_id')) {
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

if (! function_exists('formated_offer_id')) {
    function formated_offer_id(int $invoice_id): string
    {
        if (! $invoice_id) {
            return '(Entwurf)';
        }

        $formated_id = substr($invoice_id, 0, 4).'.';
        $formated_id .= substr($invoice_id, 4, 2).'.';

        $formated_id .= substr($invoice_id, 6, 3);
        // $formated_id .= substr($invoice_id, 9, 2);

        return $formated_id;
    }
}

if (! function_exists('iban_to_human_format')) {
    function iban_to_human_format($iban): string
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

if (! function_exists('sortByLength')) {
    // https://stackoverflow.com/questions/838227/php-sort-an-array-by-the-length-of-its-values
    function sortByLength($a, $b): int
    {
        return strlen($b) - strlen($a);
    }
}
