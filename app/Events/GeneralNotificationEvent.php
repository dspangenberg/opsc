<?php

/*
 * Beleg-Portal is a twiceware solution
 * Copyright (c) 2025 by Rechtsanwalt Peter Trettin
 *
 */

namespace App\Events;

use App\Models\User;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GeneralNotificationEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public User $user,
        public string $message,
    ) {}

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user.'.$this->user->id),
        ];
    }
    
    public function broadcastWith(): array
    {
        return ['message' => $this->message];
    }

    public function broadcastAs(): string
    {
        return 'general.notification';
    }
}
