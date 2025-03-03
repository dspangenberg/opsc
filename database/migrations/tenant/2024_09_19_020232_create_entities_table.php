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

return new class extends Migration {
    public function up(): void
    {
        Schema::create('accommodations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->integer('type_id')->nullable();
            $table->string('place_id')->nullable();
            $table->geometry('coordinates', subtype: 'point')->nullable();
            $table->string('street')->nullable();
            $table->string('zip')->nullable();
            $table->string('city')->nullable();
            $table->integer('country_id')->nullable();
            $table->integer('region_id')->nullable();
            $table->string('phone')->nullable();
            $table->string('website')->nullable();
            $table->string('email')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('accommodations');
    }
};
