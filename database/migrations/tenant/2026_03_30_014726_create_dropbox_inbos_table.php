<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dropbox_inboxes', function (Blueprint $table) {
            $table->id();
            $table->string('message_id');
            $table->json('payload');
            $table->foreignId('dropbox_id');
            $table->foreign('dropbox_id')->references('id')->on('dropboxes')->onDelete('cascade');
            $table->boolean('is_private')->default(false);
            $table->unique(['message_id', 'dropbox_id']);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dropbox_inboxes');
    }
};
