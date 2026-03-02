<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Blade;

class EmailTemplate extends Model
{
    protected $fillable = [
        'name',
        'subject',
        'body',
        'email_account_id',
    ];

    public function emailAccount(): BelongsTo
    {
        return $this->belongsTo(EmailAccount::class);
    }

    public static function render(string $name, array $data): array | null {
        $instance = EmailTemplate::where('name', $name)->firstOrFail();
        if ($instance) {
            $body = Blade::render($instance->body, $data);
            $subject = Blade::render($instance->subject, $data);
            return [
                'subject' => $subject,
                'body' => $body,
                'email_account_id' => $instance->email_account_id,
            ];
        }
        return null;
    }


}
