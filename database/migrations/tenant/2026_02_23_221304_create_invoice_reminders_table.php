<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('invoice_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id');
            $table->date('issued_on');
            $table->date('due_on');
            $table->date('sent_on')->nullable();
            $table->decimal('open_amount');
            $table->integer('dunning_level');
            $table->integer('dunning_days');
            $table->date('next_level_on')->nullable();
            $table->foreign('invoice_id')->references('id')->on('invoices')->onDelete('no action');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_reminders');
    }
};
