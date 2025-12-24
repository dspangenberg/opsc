<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('offer_lines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('offer_id')->index('offer_lines_offer_id_foreign');
            $table->double('quantity')->nullable();
            $table->text('unit')->nullable();
            $table->text('text');
            $table->double('price')->nullable();
            $table->double('amount')->nullable();
            $table->double('tax')->nullable();
            $table->integer('tax_id');
            $table->integer('type_id')->default(0);
            $table->integer('pos');
            $table->double('tax_rate')->nullable();
            $table->unsignedBigInteger('tax_rate_id')->default(1)->index('offer_lines_tax_rate_id_foreign');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('');
    }
};
