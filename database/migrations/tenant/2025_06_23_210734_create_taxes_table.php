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
        Schema::create('taxes', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->text('invoice_text');
            $table->decimal('value');
            $table->boolean('needs_vat_id');
            $table->boolean('is_default');
            $table->timestamps();
            $table->integer('account_input_tax')->default(0);
            $table->integer('account_vat')->default(0);
            $table->integer('tax_code_number')->default(0);
            $table->boolean('is_bidirectional')->default(false);
            $table->integer('legacy_id')->default(0);
            $table->boolean('is_used_in_invoicing')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('taxes');
    }
};
