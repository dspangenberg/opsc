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
        Schema::create('markable_bookmarks', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('user_id')->index('markable_bookmarks_user_id_foreign');
            $table->string('markable_type');
            $table->unsignedBigInteger('markable_id');
            $table->string('value')->nullable();
            $table->json('metadata')->nullable();
            $table->timestamps();

            $table->index(['markable_type', 'markable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('markable_bookmarks');
    }
};
