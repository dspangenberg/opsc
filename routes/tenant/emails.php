<?php

declare(strict_types=1);

use App\Http\Controllers\App\EmailController;
use Illuminate\Support\Facades\Route;

Route::put('emails/{dropbox}/bulk-trash', [EmailController::class, 'bulkTrash'])->name('app.email.bulk-trash');
Route::get('emails/{dropbox}/{mail?}', [EmailController::class, 'index'])->name('app.email.index');
Route::delete('emails/{dropbox}/{mail}', [EmailController::class, 'trash'])->name('app.email.trash');
Route::put('emails/{dropbox}/{mail}/restore', [EmailController::class, 'restore'])->name('app.email.restore')->withTrashed();
Route::put('emails/{dropbox}/{mail}/snooze', [EmailController::class, 'snooze'])->name('app.email.snooze');
Route::put('emails/{dropbox}/{mail}/unsnooze', [EmailController::class, 'unsnooze'])->name('app.email.unsnooze');
Route::put('emails/{dropbox}/{mail}/archive', [EmailController::class, 'archive'])->name('app.email.archive');
Route::put('emails/{dropbox}/{mail}/unarchive', [EmailController::class, 'unarchive'])->name('app.email.unarchive');
Route::put('emails/{dropbox}/{mail}/{newDropbox}', [EmailController::class, 'move'])->name('app.email.move');
Route::get('emails/{dropbox}/{mail}/{attachment}/preview', [EmailController::class, 'attachmentPreview'])->name('app.email.attachment-preview');
Route::put('emails/{dropbox}/{mail}/{attachment}/receipt', [EmailController::class, 'importAttachmentAsReceipt'])->name('app.email.attachment-receipt');
Route::put('emails/{dropbox}/{mail}/{attachment}/document', [EmailController::class, 'importAttachmentAsDocument'])->name('app.email.attachment-document');
