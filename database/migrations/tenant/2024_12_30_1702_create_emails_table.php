<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailsTable extends Migration
{
    public function up()
    {
        Schema::create('emails', function (Blueprint $table) {
            $table->id();
            $table->string('message_id')->unique();
            $table->string('subject');
            $table->text('body_plain')->nullable();
            $table->text('body_html')->nullable();
            $table->string('from_email');
            $table->string('from_name')->nullable();
            $table->json('to')->comment('JSON array of recipient emails');
            $table->json('cc')->nullable()->comment('JSON array of CC recipient emails');
            $table->json('bcc')->nullable()->comment('JSON array of BCC recipient emails');
            $table->dateTime('date_sent');
            $table->dateTime('date_received');
            $table->boolean('has_attachments')->default(false);
            $table->string('imap_folder');
            $table->unsignedBigInteger('size_in_bytes');
            $table->json('headers')->nullable();
            $table->timestamps();

            $table->index('from_email');
            $table->index('date_received');
            $table->index('imap_folder');
        });
    }

    public function down()
    {
        Schema::dropIfExists('emails');
    }
}
