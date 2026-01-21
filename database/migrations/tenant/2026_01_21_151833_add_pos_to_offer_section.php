<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('offer_sections', function (Blueprint $table) {
            if (!Schema::hasColumn('offer_sections', 'pos')) {
                $table->integer('pos')->nullable();
            }
        });
    }

    public function down(): void
    {
        Schema::table('offer_sections', function (Blueprint $table) {
            if (!Schema::hasColumn('offer_sections', 'pos')) {
                $table->dropColumn('pos');
            }
        });
    }
};
