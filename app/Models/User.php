<?php

/*
 * ospitality.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

namespace App\Models;

use Database\Factories\UserFactory;
use Eloquent;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\DatabaseNotification;
use Illuminate\Notifications\DatabaseNotificationCollection;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Carbon;
use Plank\Mediable\Exceptions\MediaUrlException;
use Plank\Mediable\Mediable;
use ProtoneMedia\LaravelVerifyNewEmail\MustVerifyNewEmail;
use Illuminate\Contracts\Auth\MustVerifyEmail;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property Carbon|null $email_verified_at
 * @property string $password
 * @property string|null $remember_token
 * @property int|null $current_team_id
 * @property string|null $profile_photo_path
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read string $full_name
 * @property-read string $initials
 * @property-read string $reverse_full_name
 * @property-read DatabaseNotificationCollection<int, DatabaseNotification> $notifications
 * @property-read int|null $notifications_count
 * @method static \Database\Factories\UserFactory factory($count = null, $state = [])
 * @method static Builder<static>|User newModelQuery()
 * @method static Builder<static>|User newQuery()
 * @method static Builder<static>|User query()
 * @method static Builder<static>|User whereCreatedAt($value)
 * @method static Builder<static>|User whereCurrentTeamId($value)
 * @method static Builder<static>|User whereEmail($value)
 * @method static Builder<static>|User whereEmailVerifiedAt($value)
 * @method static Builder<static>|User whereId($value)
 * @method static Builder<static>|User whereName($value)
 * @method static Builder<static>|User wherePassword($value)
 * @method static Builder<static>|User whereProfilePhotoPath($value)
 * @method static Builder<static>|User whereRememberToken($value)
 * @method static Builder<static>|User whereUpdatedAt($value)
 * @mixin Eloquent
 */
class User extends Authenticatable implements MustVerifyEmail
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Mediable, MustVerifyNewEmail;

    use Notifiable;
    protected $fillable = [
        'name',
        'email',
        'first_name',
        'last_name',
        'is_admin',
        'password',
        'email_verified_at',
        'is_locked',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_recovery_codes',
        'two_factor_secret',
    ];

    protected $appends = [
        'full_name',
        'reverse_full_name',
        'initials',
        'avatar_url',
    ];
    protected $attributes = [
        'is_admin' => false,
        'is_locked' => false,
    ];

    protected function casts(): array
    {
        return [
            'is_admin' => 'boolean',
            'is_locked' => 'boolean',
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function getFullNameAttribute(): string
    {
        if ($this->first_name) {
            return trim("$this->first_name $this->last_name");
        }

        return $this->last_name ?? '';
    }

    public function getInitialsAttribute(): string
    {
        if ($this->first_name) {
            return substr($this->first_name, 0, 1).substr($this->last_name, 0, 1);
        }

        return substr($this->last_name, 0, 1);
    }

    public function getReverseFullNameAttribute(): string
    {
        if ($this->first_name) {
            return "$this->last_name, $this->first_name";
        }

        return $this->last_name ?? '';
    }

    public function getAvatarUrlAttribute(): ?string
    {
        try {
            $media = $this->firstMedia('avatar');
            return $media?->getUrl();
        } catch (MediaUrlException $e) {
            return null;
        }
    }


    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new ResetPasswordNotification($token));
    }
}
