<?php

namespace App\Broadcasting;

use App\Models\User;

class GeneralChannel
{
    /**
     * Create a new channel instance.
     */
    public function __construct(
        public User $user,
        public string $message
    ) {}

    public function broadcastOn(): array
    {

        return [
            new PrivateChannel(tenant('id').'.user.'.$this->user->id),
        ];
    }

    public function broadcastWith(): array
    {
        return ['message' => $this->message];
    }

    /**
     * Authenticate the user's access to the channel.
     */
    public function join(User $user): array|bool
    {
        //
    }
}
