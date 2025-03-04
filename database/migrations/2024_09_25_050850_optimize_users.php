<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('name', 'last_name');
            $table->string('first_name')->after('last_name');
            $table->string('avatar_url')->nullable();
            $table->boolean('is_admin')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->renameColumn('last_name', 'name');
            $table->dropColumn('first_name');
            $table->dropColumn('avatar_url');
            $table->dropColumn('is_admin');
        });
    }
};
