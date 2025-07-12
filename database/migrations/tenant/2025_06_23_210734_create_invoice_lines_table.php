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
        Schema::create('invoice_lines', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('invoice_id')->index('invoice_lines_invoice_id_foreign');
            $table->double('quantity')->nullable();
            $table->text('unit')->nullable();
            $table->text('text');
            $table->double('price')->nullable();
            $table->double('amount')->nullable();
            $table->double('tax')->nullable();
            $table->integer('tax_id');
            $table->integer('type_id')->default(0);
            $table->integer('pos');
            $table->integer('legacy_id');
            $table->timestamps();
            $table->double('tax_rate')->nullable();
            $table->integer('linked_invoice_id')->default(0);
            $table->date('service_period_begin')->nullable();
            $table->date('service_period_end')->nullable();
            $table->unsignedInteger('myra_id')->nullable();
            $table->unsignedBigInteger('tax_rate_id')->default(1)->index('invoice_lines_tax_rate_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoice_lines');
    }
};
