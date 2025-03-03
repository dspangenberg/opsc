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
        Schema::create('regions', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('country_id')->unsigned();
            $table->foreign('country_id')->references(['id'])->on('countries')->onUpdate('no action')->onDelete('cascade');
            $table->string('name');
            $table->string('short_name');
            $table->string('place_short_name');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('regions');
    }
};
