<?php

namespace App\Services;

use Illuminate\Contracts\JsonSchema\JsonSchema;
use function Laravel\Ai\agent;

class MistralDocumentExtractorService
{
    /**
     * Extract information from document text using AI.
     *
     * Uses separate system instructions and user content to prevent prompt injection.
     *
     * @param string $fullText The document text to analyze
     * @return array Extracted information
     */
    public function extractInformation(string $fullText): array
    {
        // Define system instructions separately from user content
        $systemInstructions = <<<'INSTRUCTIONS'
        Extrahiere die folgenden Informationen aus dem bereitgestellten Text:

        1. Betreff: Der Hauptgegenstand oder Titel des Dokuments
        2. Zusammenfassung: Eine kurze Zusammenfassung des Inhalts (max. 3 Sätze).
           Die Zusammenfassung soll den Kern des Dokuments widerspiegeln und die
           wichtigsten Informationen enthalten. Adressierungen (z. B. "Herr Mustermann")
           sollen nicht enthalten sein.
        3. Adressen: Alle erwähnten Adressen (Name, Straße, PLZ und Ort).
           Einzelne Informationen wie Straße können fehlen.

        Gib die Ergebnisse als JSON mit den Feldern subject, summary und addresses zurück.
        INSTRUCTIONS;

        try {
            // Korrekte Verwendung der Laravel AI API mit getrennten Rollen
            $response = agent(
                instructions: $systemInstructions,
                schema: function (JsonSchema $schema) {
                    return [
                        'subject' => $schema->string()->description('Der Hauptgegenstand oder Titel des Dokuments'),
                        'summary' => $schema->string()->description('Eine kurze Zusammenfassung des Inhalts'),
                        'addresses' => $schema->array(
                            $schema->string()->description('Eine Adresse')
                        )->description('Alle erwähnten Adressen'),
                    ];
                }
            )->prompt($fullText, provider: 'mistral', model: 'mistral-medium-latest');

            // Bei strukturierter Ausgabe können wir direkt auf die Felder zugreifen
            return [
                'subject' => $response['subject'] ?? '',
                'summary' => $response['summary'] ?? '',
                'addresses' => $response['addresses'] ?? [],
            ];
        } catch (\Exception $e) {
            // Log error for debugging
            \Log::error('AI document extraction failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            // Return empty results on failure
            return [
                'subject' => '',
                'summary' => '',
                'addresses' => [],
            ];
        }
    }
}
