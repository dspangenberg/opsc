<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->renameColumn('recurring_interval_days', 'recurring_interval_units');
            $table->enum('recurring_interval', ['days', 'weeks', 'months', 'years'])->nullable();
            $table->date('recurring_next_billing_date')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->renameColumn('recurring_interval_units', 'recurring_interval_days');
            $table->dropColumn('recurring_interval');
            $table->dropColumn('recurring_next_billing_date');
        });
    }
};
