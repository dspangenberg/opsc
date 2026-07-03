<?php

namespace App\Settings\Casts;

use Spatie\LaravelSettings\SettingsCasts\SettingsCast;

class IntCast implements SettingsCast
{
    public function get($payload): mixed
    {
        if ($payload === null || $payload === '') {
            return null;
        }

        return (int) $payload;
    }

    public function set($payload): mixed
    {
        if ($payload === null || $payload === '') {
            return null;
        }

        return (int) $payload;
    }
}
