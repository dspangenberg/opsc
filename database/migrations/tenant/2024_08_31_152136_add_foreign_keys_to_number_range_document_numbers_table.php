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
        Schema::table('number_range_document_numbers', function (Blueprint $table) {
            $table->foreign(['number_range_id'])->references(['id'])->on('number_ranges')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('number_range_document_numbers', function (Blueprint $table) {
            $table->dropForeign('number_range_document_numbers_number_range_id_foreign');
        });
    }
};
