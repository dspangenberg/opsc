<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('views', function (Blueprint $table) {
            $table->id();
            $table->string('viewable_type');
            $table->string('name');
            $table->boolean('is_pinned');
            $table->unsignedBigInteger('pos');
            $table->json('data');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('views');
    }
};
