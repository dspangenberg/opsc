<?php

/*
 * ooboo.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('accommodation_types', function (Blueprint $table) {
            $table->string('title');
            $table->string('code', 4);
            $table->renameColumn('name', 'description');
        });
    }

    public function down(): void
    {
        Schema::table('accommodation_types', function (Blueprint $table) {
            $table->renameColumn('description', 'name');
            $table->dropColumn('title');
            $table->dropColumn('code');
        });
    }
};
