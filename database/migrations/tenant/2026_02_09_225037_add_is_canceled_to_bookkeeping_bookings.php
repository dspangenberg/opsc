<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('bookkeeping_bookings', function (Blueprint $table) {
            $table->boolean('is_canceled')->default(false);
            $table->unsignedBigInteger('canceled_id')->nullable();
            $table->foreign('canceled_id')->references('id')->on('bookkeeping_bookings')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('bookkeeping_bookings', function (Blueprint $table) {
            $table->dropColumn('is_canceled');
            $table->dropForeign(['canceled_id']);
            $table->dropColumn('canceled_id');
        });
    }
};
