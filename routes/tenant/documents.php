<?php

declare(strict_types=1);

use App\Http\Controllers\App\DocumentController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('/documents/preview/{document}', [DocumentController::class, 'streamPreview'])->name('app.document.preview')->withTrashed();
Route::get('/documents/pdf/{document}', [DocumentController::class, 'streamPdf'])->name('app.document.pdf')->withTrashed();

Route::patch('/documents/toggle-pinned/{document}', [DocumentController::class, 'togglePinned'])->name('app.document.toggle-pinned');


Route::delete('/documents/bulk-force-delete', [DocumentController::class, 'bulkForceDelete'])->name('app.document.bulk-force-delete');
Route::delete('/documents/{document}/force-delete', [DocumentController::class, 'forceDelete'])->name('app.document.force-delete')->withTrashed();
Route::delete('/documents/{document}', [DocumentController::class, 'trash'])->name('app.document.trash');



Route::get('/documents/{document}/restore', [DocumentController::class, 'restore'])->name('app.document.restore')->withTrashed();
Route::get('/documents/{document}/edit', [DocumentController::class, 'edit'])->name('app.document.edit');
Route::put('/documents/{document}/update', [DocumentController::class, 'update'])->name('app.document.update')->middleware([HandlePrecognitiveRequests::class]);
Route::post('/documents/multi-upload', [DocumentController::class, 'multiDocUpload'])->name('app.document.multi-upload')->middleware([HandlePrecognitiveRequests::class]);
Route::match(['GET', 'POST'], '/documents', [DocumentController::class, 'index'])
    ->name('app.document.index');

Route::post('/documents/upload', [DocumentController::class, 'upload'])->name('app.document.upload')->middleware([HandlePrecognitiveRequests::class]);
Route::get('/documents/upload-form', [DocumentController::class, 'uploadForm'])->name('app.document.upload-form');
