<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('calendar_id');
            $table->string('title');
            $table->dateTime('start_at');
            $table->dateTime('end_at');
            $table->boolean('is_fullday');
            $table->text('body');
            $table->unsignedBigInteger('category_id');
            $table->unsignedBigInteger('location_id');
            $table->text('website');
            $table->unsignedInteger('ticketshop_id');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('calendar_events');
    }
};
