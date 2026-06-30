<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_deadlines', function (Blueprint $table) {
            $table->text('invoice_text')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('payment_deadlines', function (Blueprint $table) {
            $table->dropColumn('invoice_text');
        });
    }
};
