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
        Schema::create('season_periods', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->unsignedBigInteger('season_id')->index('season_periods_season_id_foreign');
            $table->date('begin_on');
            $table->date('end_on');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('season_periods');
    }
};
