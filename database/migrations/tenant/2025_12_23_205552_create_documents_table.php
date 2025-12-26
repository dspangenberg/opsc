<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('documents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('document_type_id')->nullable();
            $table->unsignedBigInteger('contact_id')->nullable();
            $table->unsignedBigInteger('project_id')->nullable();
            $table->foreign(['contact_id'])->references(['id'])->on('contacts')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['project_id'])->references(['id'])->on('projects')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['document_type_id'])->references(['id'])->on('document_types')->onUpdate('no action')->onDelete('no action');
            $table->string('filename');
            $table->string('mime_type');
            $table->date('issued_on')->nullable();
            $table->date('sent_on')->nullable();
            $table->string('title')->nullable();
            $table->string('label')->nullable();
            $table->text('description')->nullable();
            $table->text('fulltext')->nullable();
            $table->string('reference')->nullable();
            $table->integer('pages')->default(1);
            $table->integer('file_size')->default(0);
            $table->dateTime('file_created_at')->nullable();
            $table->string('checksum');
            $table->boolean('is_confirmed')->default(false);
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
    }
};
