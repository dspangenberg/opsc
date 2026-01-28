<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('document_downloads', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->json('ids');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_downloads');
    }
};
