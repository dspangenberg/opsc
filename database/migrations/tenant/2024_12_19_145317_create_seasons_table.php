<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('seasons', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_default');
            $table->string('color')->nullable();
            $table->integer('booking_mode');
            $table->boolean('has_season_related_restrictions');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('seasons');
    }
};
