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
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreignId('tax_id')->default(1)->constrained()->references('id')->on('taxes');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('tax_id');
            $table->dropForeign('invoices_tax_id_foreign');
        });
    }
};
