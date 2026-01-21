<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('offer_offer_sections', function (Blueprint $table) {
            $table->id();
            $table->integer('offer_id');
            $table->integer('pos');
            $table->string('title')->nullable();
            $table->string('section_id');
            $table->text('content')->nullable();
            $table->boolean('pagebreak')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offer_offer_sections');
    }
};
