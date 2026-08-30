<?php

namespace App\Policies;

use App\Models\Todo;
use App\Models\User;

class TodoPolicy
{
    public function update(User $user, Todo $todo): bool
    {
        return $todo->created_by_user_id === $user->id
            || $todo->assigned_to_user_id === $user->id;
    }
}
