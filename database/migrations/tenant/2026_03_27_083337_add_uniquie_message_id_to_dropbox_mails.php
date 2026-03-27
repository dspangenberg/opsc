<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->unique('message_id');
        });
    }

    public function down(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->dropUnique('dropbox_mails_message_id_unique');
        });
    }
};
