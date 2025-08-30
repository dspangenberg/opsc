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
        Schema::create('bookkeeping_bookings', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('account_id_credit')->default(0);
            $table->integer('account_id_debit')->default(0);
            $table->double('amount')->default(0);
            $table->date('date');
            $table->integer('tax_id')->default(0);
            $table->boolean('is_split')->default(false);
            $table->integer('split_id')->default(0);
            $table->string('booking_text');
            $table->text('note')->nullable();
            $table->double('tax_credit')->default(0);
            $table->double('tax_debit')->default(0);
            $table->boolean('is_locked')->default(false);
            $table->timestamps();
            $table->string('bookable_type');
            $table->unsignedBigInteger('bookable_id');
            $table->boolean('is_marked')->default(false);
            $table->unsignedBigInteger('number_range_document_numbers_id');

            $table->index(['bookable_type', 'bookable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookkeeping_bookings');
    }
};
