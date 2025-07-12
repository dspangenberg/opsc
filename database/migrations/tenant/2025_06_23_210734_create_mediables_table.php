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
        Schema::create('mediables', function (Blueprint $table) {
            $table->unsignedBigInteger('media_id');
            $table->string('mediable_type');
            $table->unsignedBigInteger('mediable_id');
            $table->string('tag')->index();
            $table->unsignedInteger('order')->index();

            $table->index(['mediable_id', 'mediable_type']);
            $table->index(['mediable_type', 'mediable_id']);
            $table->primary(['media_id', 'mediable_type', 'mediable_id', 'tag']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mediables');
    }
};
