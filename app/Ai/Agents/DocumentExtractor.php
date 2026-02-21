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

class DocumentExtractor implements Agent, Conversational, HasTools, HasStructuredOutput
{
    use Promptable;

    /**
     * Get the instructions that the agent should follow.
     */
    public function instructions(): Stringable|string
    {
        return <<<'INSTRUCTIONS'
         Extrahiere die folgenden Informationen aus dem bereitgestellten Text:

        1. Betreff: Der Hauptgegenstand oder Titel des Dokuments als title.
        2. Ermittel das Erstellungsdatum des Dokuments im Format YYYY-MM-DD als issued_on.
        3. Zusammenfassung: Eine kurze Zusammenfassung des Inhalts (max. 3 Sätze).
           Die Zusammenfassung soll den Kern des Dokuments widerspiegeln und die
           wichtigsten Informationen enthalten. Adressierungen (z. B. "Herr Mustermann")
           sollen nicht enthalten sein als summary.

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
            'title' => $schema->string()->required(),
            'issued_on' => $schema->string()->required(),
            'summary' => $schema->string()->required(),
        ];
    }
}
