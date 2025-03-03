<?php

namespace App\Jobs;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class CreateTenantAdminJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected Tenant $tenant;

    public function __construct(Tenant $tenant)
    {
        $this->tenant = $tenant;
    }

    public function handle(): void
    {
        $this->tenant->run(function ($tenant) {

            dump($tenant); // dump tenant data for debugging purposes

            $userData = collect($tenant)->only(['first_name', 'last_name', 'email', 'password'])->toArray();
            $userData['is_admin'] = true;
            $userData['email_verified_at'] = now();

            dump($userData); // dump user data for debugging purposes

            User::create($userData);

            $tenant->update([
                'password' => null,
                'ready' => true,
            ]);

            return $tenant;
        });
    }
}
