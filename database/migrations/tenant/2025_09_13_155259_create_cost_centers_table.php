<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cost_centers', function (Blueprint $table) {
            $table->id();
$table->string('name');
$table->foreignId('bookkeeping_account_id')->nullable();
$table->timestamps();//
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cost_centers');
    }
};
