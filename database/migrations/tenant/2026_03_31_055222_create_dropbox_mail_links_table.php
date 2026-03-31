<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dropbox_mail_links', function (Blueprint $table) {
            $table->id();
            $table->string('link_type');
            $table->unsignedBigInteger('link_id');
            $table->foreignId('dropbox_mail_id');
            $table->foreign('dropbox_mail_id')->references('id')->on('dropbox_mails')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dropbox_mail_links');
    }
};
