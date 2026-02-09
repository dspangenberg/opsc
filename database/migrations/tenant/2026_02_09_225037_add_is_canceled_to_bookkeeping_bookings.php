<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('bookkeeping_bookings', function (Blueprint $table) {
            $table->boolean('is_canceled')->default(false);
            $table->integer('canceled_id')->default(0);
        });
    }

    public function down(): void
    {
        Schema::table('bookkeeping_bookings', function (Blueprint $table) {
            $table->dropColumn('is_canceled');
            $table->dropColumn('canceled_id');
        });
    }
};
