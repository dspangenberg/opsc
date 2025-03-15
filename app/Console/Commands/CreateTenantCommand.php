<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Console\Commands;

use Illuminate\Console\Command;

class CreateTenantCommand extends Command
{
    protected $signature = 'create:tenant';

    protected $description = 'Command description';

    public function handle(): void
    {
        $name = $this->ask('What is your name?');
    }
}
