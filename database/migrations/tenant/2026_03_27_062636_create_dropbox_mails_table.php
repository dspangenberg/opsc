<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dropbox_mails', function (Blueprint $table) {
            $table->id();
            $table->string('message_id');
            $table->string('subject');
            $table->string('text');
            $table->json('references');
            $table->string('from');
            $table->json('to');
            $table->string('html');
            $table->string('in_reply_to')->nullable();
            $table->foreignId('dropbox_id');
            $table->dateTime('timestamp');
            $table->timestamps();

            $table->foreign('dropbox_id')->references('id')->on('dropboxes')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dropbox_mails');
    }
};
