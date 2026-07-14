<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->timestamp('snoozed_until')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->dropColumn('snoozed_until');
        });
    }
};
