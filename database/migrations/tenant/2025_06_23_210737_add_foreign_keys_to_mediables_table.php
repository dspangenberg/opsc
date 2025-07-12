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
        Schema::table('mediables', function (Blueprint $table) {
            $table->foreign(['media_id'])->references(['id'])->on('media')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('mediables', function (Blueprint $table) {
            $table->dropForeign('mediables_media_id_foreign');
        });
    }
};
