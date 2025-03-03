<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Database\QueryException;
use Illuminate\View\ViewException;
use Inertia\Inertia;
use Inertia\Response;
use Stancl\Tenancy\Database\Exceptions\TenantDatabaseDoesNotExistException;

class Handler extends Exception
{
    /**
     * Report the exception.
     */
    public function report(): void
    {
        // ...
    }

    /**
     * Render the exception into an HTTP response.
     */
    public function render(Exception $exception): Response|null
    {
        if (
            ($exception instanceof TenantDatabaseDoesNotExistException) ||
            (tenant() && (!tenant('ready')) && $exception instanceof QueryException) ||
            (tenant() && (!tenant('ready')) && $exception instanceof ViewException && $exception->getPrevious() instanceof QueryException)
        ) {
            return Inertia::render('App/BuildingView');
        }

        return null;
    }
}
