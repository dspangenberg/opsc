<?php

namespace App\Ai\Agents;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use Laravel\Ai\Contracts\Agent;
use Laravel\Ai\Contracts\Conversational;
use Laravel\Ai\Contracts\HasStructuredOutput;
use Laravel\Ai\Contracts\HasTools;
use Laravel\Ai\Contracts\Tool;
use Laravel\Ai\Promptable;
use Stringable;

class ReceiptExtractor implements Agent, Conversational, HasTools, HasStructuredOutput
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'INSTRUCTIONS'
        Extrahiere die folgenden Informationen aus dem bereitgestellten Text, der ein Rechnungsdokument ist:

        1. Währung: Die Währung, in der die Rechnung ausgegeben wird. Nutze nur gültige Währungsbezeichnungen wie EUR, USD, GBP usw als currency.
        2. Betrag: Der Bruttobetrag der Rechnung als amount.
        3. Die Referenz (z. B. Rechnungsnummer, Invoice ID, Receipt Id etc.) als reference.
        4. Das Datum der Rechnung als issued_on im Format YYYY-MM-DD.
        5. Den Aussteller der Rechnung und dessen IBAN und VAT-ID.
        6. Ermittel den Creditor aus den creditors und übergebe den Wert account_number
        7. Ermittel die Kostenstelle anhand der constCenters
        8. Bewerte die Vollständigkeit der Rechnung basierend auf den extrahierten Daten als confidence

        INSTRUCTIONS;
    }

    /**
     * Get the list of messages comprising the conversation so far.
     */
    public function messages(): iterable
    {
        return [];
    }

    /**
     * Get the tools available to the agent.
     *
     * @return Tool[]
     */
    public function tools(): iterable
    {
        return [];
    }

    /**
     * Get the agent's structured output schema definition.
     */
    public function schema(JsonSchema $schema): array
    {
        return [
            'currency' => $schema->string()->required(),
            'amount' => $schema->number()->required(),
            'reference' => $schema->string()->required(),
            'issued_on' => $schema->string()->required(),
            'creditor_name' => $schema->string()->required(),
            'creditor_iban' => $schema->string()->required(),
            'creditor_vat_id' => $schema->string()->required(),
            'creditor_id' => $schema->integer(),
            'costcenter' => $schema->integer(),
            'confidence' => $schema->number(),
        ];
    }
}
