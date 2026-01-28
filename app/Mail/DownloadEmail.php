<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class DownloadEmail extends Mailable
{
    use Queueable, SerializesModels;

    public User $user;
    public string $verificationUrl;

    public function __construct(User $user, string $verificationUrl)
    {
        $this->user = $user;
        $this->verificationUrl = $verificationUrl;
    }

    public function build()
    {
        return $this->subject('opsc.cloud - Dein Download ist bereit')
            ->view('generated.download', [
                'name' => $this->user->first_name,
                'verificationUrl' => $this->verificationUrl,
            ]);
    }
}
