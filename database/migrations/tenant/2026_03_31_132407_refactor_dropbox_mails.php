<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::dropIfExists('dropbox_mails');
        Schema::create('dropbox_mails', function (Blueprint $table) {
            $table->id();
            $table->string('message_id');
            $table->string('subject');
            $table->string('from');
            $table->longText('to');
            $table->longText('cc');
            $table->longText('body');
            $table->string('in_reply_to')->nullable();
            $table->longText('references')->nullable();
            $table->foreignId('dropbox_id');
            $table->foreign('dropbox_id')->references('id')->on('dropboxes')->onDelete('cascade');
            $table->dateTime('date');
            $table->dateTime('seen_at')->nullable();
            $table->boolean('is_private')->default(false);

            $table->timestamps();
        });
    }

    public function down(): void {}
};
