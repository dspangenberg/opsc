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
        Schema::table('bookkeeping_rule_actions', function (Blueprint $table) {
            $table->foreign(['bookkeeping_rule_id'])->references(['id'])->on('bookkeeping_rules')->onUpdate('no action')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookkeeping_rule_actions', function (Blueprint $table) {
            $table->dropForeign('bookkeeping_rule_actions_bookkeeping_rule_id_foreign');
        });
    }
};
