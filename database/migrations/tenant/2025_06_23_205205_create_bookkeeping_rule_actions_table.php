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
        Schema::create('bookkeeping_rule_actions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('bookkeeping_rule_id')->index('bookkeeping_rule_actions_bookkeeping_rule_id_foreign');
            $table->integer('priority')->default(10);
            $table->string('field');
            $table->string('value');
            $table->timestamps();
            $table->enum('table', ['transactions', 'documents', 'payments', 'receipts', 'bookings', 'mm_import', 'receipts_import']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookkeeping_rule_actions');
    }
};
