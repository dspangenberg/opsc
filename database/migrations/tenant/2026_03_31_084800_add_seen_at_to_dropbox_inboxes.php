<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('dropbox_inboxes', function (Blueprint $table) {
            $table->dateTime('seen_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('dropbox_inboxes', function (Blueprint $table) {
            $table->dropColumn('seen_at');
        });
    }
};
