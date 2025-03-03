<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateEmailAttachmentsTable extends Migration
{
    public function up()
    {
        Schema::create('email_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('email_id');
            $table->string('filename');
            $table->string('mime_type');
            $table->unsignedBigInteger('size_in_bytes');
            $table->string('storage_path');
            $table->timestamps();

            $table->foreign('email_id')->references('id')->on('emails')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('email_attachments');
    }
}
