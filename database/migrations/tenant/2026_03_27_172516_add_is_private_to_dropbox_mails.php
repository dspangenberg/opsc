<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->boolean('is_private')->default(false);
            $table->boolean('is_processed')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->dropColumn('is_private');
            $table->dropColumn('is_processed');
        });
    }
};
