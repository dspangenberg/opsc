<?php

namespace App\Services;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use function Laravel\Ai\agent;

class MistralDocumentExtractorService
{
    public function extractInformation(string $fullText): array
    {
        $promptText = <<<PROMPT
        Extrahiere die folgenden Informationen aus dem Text:

        1. Betreff: Der Hauptgegenstand oder Titel des Dokuments
        2. Zusammenfassung: Eine kurze Zusammenfassung des Inhalts (max. 3 Sätze). Hierbei soll die Zusammenfassung den Kern des Dokuments widerspiegeln und die wichtigsten Informationen enthalten. An wen das Dokument adressiert (z. B. Herr Mustermann) ist, soll nicht enthalten sein.
        3. Adressen: Alle erwähnten Adressen (Name, Straße, PLZ und Ort). In Adressen können auch einzelne Informationen z. B. Straße fehlen. 

        Text:
        $fullText
        PROMPT;

        // Korrekte Verwendung der Laravel AI API mit strukturierter Ausgabe
        $response = agent(
            instructions: 'Extrahiere Informationen aus Dokumenten.',
            schema: function (JsonSchema $schema) {
                return [
                    'subject' => $schema->string()->description('Der Hauptgegenstand oder Titel des Dokuments'),
                    'summary' => $schema->string()->description('Eine kurze Zusammenfassung des Inhalts'),
                    'addresses' => $schema->array(
                        $schema->string()->description('Eine Adresse')
                    )->description('Alle erwähnten Adressen'),
                ];
            }
        )->prompt($promptText, provider: 'mistral', model: 'mistral-medium-latest');

        // Bei strukturierter Ausgabe können wir direkt auf die Felder zugreifen
        return [
            'subject' => $response['subject'] ?? '',
            'summary' => $response['summary'] ?? '',
            'addresses' => $response['addresses'] ?? [],
        ];
    }
}
