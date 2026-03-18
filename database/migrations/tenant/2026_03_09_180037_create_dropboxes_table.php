<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('dropboxes', function (Blueprint $table) {
            $table->id();
            $table->string('email_address');
            $table->string('name');
            $table->boolean('is_shared');
            $table->boolean('is_auto_processing');
            $table->timestamps();

            $table->unique('email_address');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('dropboxes');
    }
};
