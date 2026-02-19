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

    /**
     * Handle the job.
     *
     * Generates a secure random password for the tenant admin user.
     * The password is cryptographically secure and unique for each tenant.
     */
    public function handle(): void
    {
        $this->tenant->run(function ($tenant) {

            $userData = collect($tenant)->only(['first_name', 'last_name', 'email'])->toArray();
            
            // Generate a cryptographically secure random password
            $randomPassword = bin2hex(random_bytes(16));
            $userData['password'] = bcrypt($randomPassword);
            
            $userData['is_admin'] = true;
            $userData['email_verified_at'] = now();

            $user = User::create($userData);

            $tenant->update([
                'password' => null,
                'ready' => true,
            ]);

            return $tenant;
        });
    }
}
