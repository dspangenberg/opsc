<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class VerifyFirstEmail extends Mailable
{
    use Queueable, SerializesModels;

    public Model $pendingUserEmail;

    public function __construct(Model $pendingUserEmail)
    {
        $this->pendingUserEmail = $pendingUserEmail;
    }

    public function build()
    {
        $user = $this->pendingUserEmail->user;
        $name = $user?->first_name ?: ($user?->full_name ?? $user?->email ?? ''); // fallback

        return $this->subject('opsc.cloud - Bitte bestaetige Deine E-Mail-Adresse')
            ->view('generated.verify-email', [
                'name' => $name,
                'verificationUrl' => $this->pendingUserEmail->verificationUrl(),
            ]);
    }
}
