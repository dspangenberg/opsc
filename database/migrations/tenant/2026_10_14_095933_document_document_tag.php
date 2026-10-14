<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_document_tag', function (Blueprint $table) {
            $table->foreignId('document_id')->constrained('documents')->cascadeOnDelete();
            $table->foreignId('document_tag_id')->constrained('document_tags')->cascadeOnDelete();
            $table->primary(['document_id', 'document_tag_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_document_tag');
    }
};
