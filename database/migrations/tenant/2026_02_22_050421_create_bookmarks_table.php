<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('bookmarks', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('model');
            $table->string('route_name');
            $table->json('route_params');
            $table->boolean('is_pinned');
            $table->foreignId('bookmark_folder_id')->nullable();
            $table->integer('pos');
            $table->timestamps();
            $table->foreign('bookmark_folder_id')->references('id')->on('bookmark_folders')->onDelete('set null');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookmarks');
    }
};
