<?php

namespace App\Providers;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\ServiceProvider;

class ValidationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        Validator::extend('exists_if_not_empty', function ($attribute, $value, $parameters, $validator) {
            // Wenn Wert leer ist, nicht validieren
            if (empty($value) && $value !== '0') {
                return true;
            }

            $table = $parameters[0] ?? null;
            $column = $parameters[1] ?? 'id';

            if (!$table) {
                return false;
            }

            return DB::table($table)->where($column, $value)->exists();
        });

        Validator::replacer('exists_if_not_empty', function ($message, $attribute, $rule, $parameters) {
            return str_replace(':attribute', $attribute, 'Der gewählte Wert für :attribute ist ungültig.');
        });
    }
}
