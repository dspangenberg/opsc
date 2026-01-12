<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('attachments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('attachable_type');
            $table->unsignedBigInteger('attachable_id');
            $table->unsignedBigInteger('document_id');
            $table->integer('pos')->default(0);
            $table->foreign(['document_id'])->references(['id'])->on('documents')->onUpdate('no action')->onDelete('no action');
            $table->index(['attachable_type', 'attachable_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attachments');
    }
};
