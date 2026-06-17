<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->string('zugferd_route_id')->nullable();
            $table->enum('zugferd_profile', ['zugferd', 'xrechnung3'])->default('zugferd');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn('zugferd_route_id');
            $table->dropColumn('zugferd_profile');
        });
    }
};
