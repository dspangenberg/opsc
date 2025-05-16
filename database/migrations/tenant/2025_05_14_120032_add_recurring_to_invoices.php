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
            $table->boolean('is_recurring')->default(false);
            $table->integer('recurring_interval_days')->default(0);
            $table->date('recurring_begin_on')->nullable();
            $table->date('recurring_end_on')->nullable();
            $table->foreignId('parent_id')->nullable()->constrained()->references('id')->on('invoices')->onUpdate('cascade')->onDelete('set null');
            $table->unique('invoice_number');
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('is_recurring');
            $table->dropColumn('recurring_interval_days');
            $table->dropColumn('recurring_begin_on');
            $table->dropColumn('recurring_end_on');
            $table->dropForeign('invoices_parent_id_foreign');
            $table->dropColumn('parent_id');
            $table->dropIndex('invoices_invoice_number_unique');
        });
    }
};
