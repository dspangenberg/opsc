<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->json('full_payload')->nullable();
            $table->longText('plain_body')->nullable();
            $table->json('cc')->nullable();
            $table->json('bcc')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('dropbox_mails', function (Blueprint $table) {
            $table->dropColumn('full_payload');
            $table->dropColumn('plain_body');
            $table->dropColumn('cc');
            $table->dropColumn('bcc');
        });
    }
};
