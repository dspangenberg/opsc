<?php

namespace App\Console\Commands;

use App\Facades\PloiService;
use App\Models\Tenant;
use Illuminate\Console\Command;
use Illuminate\Http\Client\ConnectionException;

class CheckPloiApiCommand extends Command
{
    protected $signature = 'check:ploi-api';

    protected $description = 'Command description';

    /**
     * @throws ConnectionException
     */
    public function handle(): void
    {
        $tenant = Tenant::find('98ba2c15-5dde-4bdf-9e0a-abe963088948')->first();
        PloiService::acknowledgeDatabase($tenant);
    }
}
