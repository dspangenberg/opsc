<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->foreignId('primary_contact_id')->nullable();
            $table->foreign('primary_contact_id')->references('id')->on('contacts')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropForeign(['primary_contact_id']);
            $table->dropColumn('primary_contact_id');
        });
    }
};
