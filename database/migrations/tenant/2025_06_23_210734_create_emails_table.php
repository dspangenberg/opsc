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
        Schema::create('emails', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('message_id')->unique();
            $table->string('subject');
            $table->text('body_plain')->nullable();
            $table->text('body_html')->nullable();
            $table->string('from_email')->index();
            $table->string('from_name')->nullable();
            $table->json('to')->comment('JSON array of recipient emails');
            $table->json('cc')->nullable()->comment('JSON array of CC recipient emails');
            $table->json('bcc')->nullable()->comment('JSON array of BCC recipient emails');
            $table->dateTime('date_sent');
            $table->dateTime('date_received')->index();
            $table->boolean('has_attachments')->default(false);
            $table->string('imap_folder')->index();
            $table->unsignedBigInteger('size_in_bytes');
            $table->json('headers')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('emails');
    }
};
