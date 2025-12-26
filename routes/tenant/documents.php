<?php

declare(strict_types=1);

use App\Http\Controllers\App\Document\DocumentController;
use App\Http\Controllers\App\Document\DocumentTypeController;
use Illuminate\Foundation\Http\Middleware\HandlePrecognitiveRequests;
use Illuminate\Support\Facades\Route;

Route::get('/documents/preferences/document-types', [DocumentTypeController::class, 'index'])->name('app.documents.document_types.index');
Route::get('/documents/preferences/document-types/create', [DocumentTypeController::class, 'create'])->name('app.documents.document_types.create');

Route::post('/documents/preferences/document-types', [DocumentTypeController::class, 'store'])
    ->middleware([HandlePrecognitiveRequests::class])
    ->name('app.documents.document_types.store');

Route::get('/documents/preferences/document-types/{documentType}/edit', [DocumentTypeController::class, 'edit'])->name('app.documents.document_types.edit')->middleware([HandlePrecognitiveRequests::class]);
Route::put('/documents/preferences/document-types/{documentType}/edit', [DocumentTypeController::class, 'update'])->name('app.documents.document_types.update');


Route::get('/documents/preview/{document}', [DocumentController::class, 'streamPreview'])->name('app.documents.documents.preview')->withTrashed();
Route::get('/documents/pdf/{document}', [DocumentController::class, 'streamPdf'])->name('app.documents.documents.pdf')->withTrashed();



Route::delete('/documents/{document}/force-delete', [DocumentController::class, 'forceDelete'])->name('app.documents.documents.force-delete')->withTrashed();
Route::delete('/documents/{document}', [DocumentController::class, 'trash'])->name('app.documents.documents.trash');

Route::get('/documents/{document}/restore', [DocumentController::class, 'restore'])->name('app.documents.documents.restore')->withTrashed();
Route::get('/documents/{document}/edit', [DocumentController::class, 'edit'])->name('app.documents.documents.edit');
Route::put('/documents/{document}/update', [DocumentController::class, 'update'])->name('app.documents.documents.update')->middleware([HandlePrecognitiveRequests::class]);

Route::match(['GET', 'POST'], '/documents/documents', [DocumentController::class, 'index'])
    ->name('app.documents.documents.index');

Route::post('/documents/documents/upload', [DocumentController::class, 'upload'])->name('app.documents.documents.upload')->middleware([HandlePrecognitiveRequests::class]);
Route::get('/documents/documents/upload-form', [DocumentController::class, 'uploadForm'])->name('app.documents.documents.upload-form');
