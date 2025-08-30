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
        Schema::create('bookkeeping_accounts', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('account_number');
            $table->string('name');
            $table->string('type', 1);
            $table->boolean('is_default')->default(false);
            $table->timestamps();
            $table->integer('tax_id')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bookkeeping_accounts');
    }
};
