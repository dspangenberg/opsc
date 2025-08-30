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
        Schema::table('transactions', function (Blueprint $table) {
            $table->foreign(['booking_id'])->references(['id'])->on('bookkeeping_bookings')->onUpdate('no action')->onDelete('no action');
            $table->foreign(['number_range_document_numbers_id'])->references(['id'])->on('number_range_document_numbers')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropForeign('transactions_booking_id_foreign');
            $table->dropForeign('transactions_number_range_document_numbers_id_foreign');
        });
    }
};
