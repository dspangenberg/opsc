<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('inbox_entries', function (Blueprint $table) {
            $table->id();

            // Postal Webhook Daten
            $table->json('payload');

            // Verarbeitungsstatus
            $table->enum('status', ['pending', 'accepted', 'rejected'])->default('pending');

            $table->string('from');
            $table->string('to');

            $table->foreignId('processed_by')->nullable();
            $table->foreign('processed_by')->references('id')->on('users')->onDelete('set null');

            $table->timestamp('processed_at')->nullable();

            $table->foreignId('user_id')->nullable();
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');

            // Metadaten
            $table->string('message_id')->nullable();
            $table->dateTime('received_at');
            $table->dateTime('sent_at');
            $table->timestamps();

            $table->index('status');
            $table->index('message_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inbox_entries');
    }
};
