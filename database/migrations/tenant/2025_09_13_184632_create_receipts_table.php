<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('receipts', function (Blueprint $table) {
            $table->id();
            $table->date('issued_on');
            $table->string('org_filename');
            $table->unsignedBigInteger('file_size');
            $table->dateTime('file_created_at');
            $table->foreignId('contact_id')->nullable();
            $table->foreignId('cost_center_id')->nullable();
            $table->foreignId('bookkeeping_account_id')->nullable();
            $table->string('org_currency')->nullable();
            $table->decimal('org_amount')->nullable();
            $table->decimal('amount');
            $table->boolean('is_confirmed');
            $table->string('reference');
            $table->decimal('exchange_rate')->nullable();
            $table->string('iban');
            $table->foreignId('number_range_document_number_id')->nullable();
            $table->string('checksum');
            $table->longText('text');
            $table->json('data');
            $table->integer('pages');
            $table->timestamps();
            $table->unsignedBigInteger('duplicate_of')->nullable();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('receipts');
    }
};
