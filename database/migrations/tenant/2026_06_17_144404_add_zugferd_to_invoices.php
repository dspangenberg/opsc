<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->boolean('is_zugferd')->default(false);
            $table->enum('zugferd_profile', ['zugferd', 'xrechnung3'])->default('zugferd');
            $table->string('zugferd_route_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropColumn('is_zugferd');
            $table->dropColumn('zugferd_profile');
            $table->dropColumn('zugferd_route_id');
        });
    }
};
