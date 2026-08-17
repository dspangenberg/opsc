<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->nullableMorphs('todoable');
            $table->string('title');
            $table->foreignId('created_by_user_id');
            $table->foreign('created_by_user_id')->references('id')->on('users')->onDelete('no action');
            $table->foreignId('assigned_to_user_id')->nullable();
            $table->foreign('assigned_to_user_id')->references('id')->on('users')->onDelete('no action');
            $table->timestamp('due_at')->nullable();
            $table->timestamp('completed_at')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};
