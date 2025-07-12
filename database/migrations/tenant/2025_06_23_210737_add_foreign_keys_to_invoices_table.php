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
        Schema::table('invoices', function (Blueprint $table) {
            $table->foreign(['parent_id'])->references(['id'])->on('invoices')->onUpdate('cascade')->onDelete('set null');
            $table->foreign(['tax_id'])->references(['id'])->on('taxes')->onUpdate('no action')->onDelete('no action');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign('invoices_parent_id_foreign');
            $table->dropForeign('invoices_tax_id_foreign');
        });
    }
};
