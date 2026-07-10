<?php

use App\Models\Tenant;
use App\Models\User;

// Registers a channel prefixed with '{tenant}.'
tenant_channel('user.{id}', function (User $user, Tenant $tenant, int $id) {
    return (int) $user->id === (int) $id;
});
