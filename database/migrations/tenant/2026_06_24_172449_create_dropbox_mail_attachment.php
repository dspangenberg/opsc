<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('dropbox_mail_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dropbox_mail_id')->constrained('dropbox_mails')->cascadeOnDelete();
            $table->string('filename');
            $table->string('mime_type');
            $table->unsignedBigInteger('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dropbox_mail_attachments');
    }
};
