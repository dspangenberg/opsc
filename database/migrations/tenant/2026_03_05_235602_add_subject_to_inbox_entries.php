<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('inbox_entries', function (Blueprint $table) {
            $table->string('subject')->after('message_id')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('inbox_entries', function (Blueprint $table) {
            $table->dropColumn('subject');
        });
    }
};
