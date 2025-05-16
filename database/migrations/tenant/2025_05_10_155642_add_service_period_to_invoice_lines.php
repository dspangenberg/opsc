<?php
/*
 * opsc.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invoice_lines', function (Blueprint $table) {
            $table->date('service_period_begin')->nullable();
            $table->date('service_period_end')->nullable();
            $table->integer('myra_id')->nullable()->unsigned();

        });
    }

    public function down(): void
    {
        Schema::table('invoice_lines', function (Blueprint $table) {
            $table->dropColumn('service_period_begin');
            $table->dropColumn('service_period_end');
            $table->dropColumn('myra_id');
        });
    }
};
