<?php

/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Console\Commands;

use Illuminate\Console\Command;
use function Laravel\Prompts\form;
class CreateTenantCommand extends Command
{
    protected $signature = 'create:tenant';

    protected $description = 'Command description';

    public function handle(): void
    {
        $responses = form()
            ->text('Nachname:', required: true, default: '', name: 'last_name')
            ->text('Vorname:', required: true, default: '', name: 'first_name')
            ->text('Firma:', required: true, default: '', name: 'company')
            ->text('E-Mail:', required: true, default: '', name: 'email')
            ->text('Domain:', required: true, default: '', name: 'domain')
            ->submit();



    }
}
