<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('print_layouts', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('title');
            $table->unsignedBigInteger('letterhead_id');
            $table->text('css')->nullable();
            $table->timestamps();
            $table->foreign(['letterhead_id'])->references(['id'])->on('letterheads')->onUpdate('no action')->onDelete('no action');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('print_layouts');
    }
};
