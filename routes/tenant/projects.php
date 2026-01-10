<?php

declare(strict_types=1);

use App\Http\Controllers\App\ProjectController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('projects', [ProjectController::class, 'index'])->name('app.project.index');

Route::get('projects/create', [ProjectController::class, 'create'])->name('app.project.create');

Route::post('projects', [ProjectController::class, 'store'])
    ->name('app.project.store')
    ->middleware([HandlePrecognitiveRequests::class]);

Route::get('projects/{project}', [ProjectController::class, 'show'])->name('app.project.details');

Route::get('projects/{project}/edit', [ProjectController::class, 'edit'])->name('app.project.edit');

Route::put('projects/{project}/edit', [ProjectController::class, 'update'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.project.update');

Route::delete('projects/{project}', [ProjectController::class, 'trash'])->name('app.project.delete');
