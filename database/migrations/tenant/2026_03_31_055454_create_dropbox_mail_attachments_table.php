<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dropbox_mail_attachments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('dropbox_mail_id');
            $table->foreign('dropbox_mail_id')->references('id')->on('dropbox_mails')->onDelete('cascade');
            $table->string('mime_type');
            $table->string('filename');
            $table->integer('size');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dropbox_mail_attachments');
    }
};
