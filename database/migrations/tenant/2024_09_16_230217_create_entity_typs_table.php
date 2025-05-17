<?php

/*
 * Ooboo.core and this file are licensed under the terms of the European Union Public License (EUPL)
 *  (c) 2024 by Danny Spangenberg (twiceware solutions e. K.)
 *  os@ooboo.core
 *  http://ooboo.core
 *
 *
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('accommodation_types', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_from_system_catalog');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodation_types');
    }
};
