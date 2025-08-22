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
        Schema::create('transactions', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('mm_ref');
            $table->integer('contact_id');
            $table->integer('bank_account_id');
            $table->date('valued_on');
            $table->date('booked_on')->nullable();
            $table->text('comment')->nullable();
            $table->string('currency');
            $table->string('booking_key')->nullable();
            $table->string('bank_code')->nullable();
            $table->string('account_number')->nullable();
            $table->string('name');
            $table->string('purpose')->nullable();
            $table->double('amount');
            $table->boolean('is_private')->default(false);
            $table->timestamps();
            $table->string('prefix', 3)->default('PBG');
            $table->string('booking_text')->nullable();
            $table->string('type')->nullable();
            $table->string('return_reason')->nullable();
            $table->string('transaction_code')->nullable();
            $table->string('end_to_end_reference')->nullable();
            $table->string('mandate_reference')->nullable();
            $table->string('batch_reference')->nullable();
            $table->string('primanota_number')->nullable();
            $table->boolean('is_transit')->default(false);
            $table->unsignedBigInteger('booking_id')->nullable()->index('transactions_booking_id_foreign');
            $table->string('org_category')->nullable();
            $table->double('amount_in_foreign_currency')->default(0);
            $table->unsignedBigInteger('number_range_document_numbers_id')->unique()->nullable();
            $table->string('foreign_currency')->nullable();
            $table->integer('counter_account_id')->default(0);
            $table->boolean('is_locked')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
