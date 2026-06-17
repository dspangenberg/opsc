<?php

namespace App\Console\Commands;

use App\Services\PdfService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('pdf:fix {file : Path to the PDF file}')]
#[Description('Fix common PDF/A-3B violations in a PDF file')]
class PdfFixCommand extends Command
{
    public function handle(): int
    {
        $path = $this->argument('file');

        if (! file_exists($path)) {
            $this->error("File not found: {$path}");

            return Command::FAILURE;
        }

        PdfService::fixPdfForPdfA($path);

        $this->info("Fixed: {$path}");

        return Command::SUCCESS;
    }
}
