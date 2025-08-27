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
        Schema::create('payments', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('payable_type');
            $table->unsignedBigInteger('payable_id');
            $table->integer('booking_id')->default(0);
            $table->integer('transaction_id');
            $table->double('amount');
            $table->boolean('is_private')->default(false);
            $table->date('issued_on');
            $table->boolean('is_confirmed')->default(false);
            $table->integer('rank')->default(0);
            $table->softDeletes();
            $table->timestamps();
            $table->boolean('is_currency_difference')->default(false);
            $table->boolean('is_ignored')->default(false);

            $table->index(['payable_type', 'payable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
