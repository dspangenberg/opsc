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
        Schema::table('address_categories', function (Blueprint $table) {
            $table->boolean('is_invoice_address')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('address_categories', function (Blueprint $table) {
            $table->dropColumn('is_invoice_address');
        });
    }
};
