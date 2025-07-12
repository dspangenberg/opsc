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
        Schema::table('season_periods', function (Blueprint $table) {
            $table->foreign(['season_id'])->references(['id'])->on('seasons')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('season_periods', function (Blueprint $table) {
            $table->dropForeign('season_periods_season_id_foreign');
        });
    }
};
