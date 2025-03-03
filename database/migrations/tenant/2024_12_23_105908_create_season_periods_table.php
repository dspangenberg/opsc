<?php
/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('season_periods', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('season_id');
            $table->date('begin_on');
            $table->date('end_on');
            $table->timestamps();
            $table->softDeletes();
            $table->foreign('season_id')->references('id')->on('seasons')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('season_periods');
    }
};
