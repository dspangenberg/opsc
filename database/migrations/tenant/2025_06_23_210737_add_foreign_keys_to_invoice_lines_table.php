<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invoice_lines', function (Blueprint $table) {
            $table->foreign(['invoice_id'])->references(['id'])->on('invoices')->onUpdate('no action')->onDelete('cascade');
            $table->foreign(['tax_rate_id'])->references(['id'])->on('tax_rates')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoice_lines', function (Blueprint $table) {
            $table->dropForeign('invoice_lines_invoice_id_foreign');
            $table->dropForeign('invoice_lines_tax_rate_id_foreign');
        });
    }
};
