<?php

use App\Models\Tenant;
use App\Models\User;

// Registers a channel prefixed with '{tenant}.'
tenant_channel('App.Models.User.{id}', function (User $user, Tenant $tenant) {
    return (int) $user->id === (int) $id;
});
