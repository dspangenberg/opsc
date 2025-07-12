<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('booking_policies', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->boolean('is_default')->default(false);
            $table->integer('age_min')->default(0);
            $table->string('arrival_days')->default('0,1,2,3,4,5,6');
            $table->string('departure_days')->default('0,1,2,3,4,5,6');
            $table->integer('stay_min')->default(1);
            $table->integer('stay_max')->default(0);
            $table->integer('booking_days_in_advance')->default(0);
            $table->integer('checkin')->default(1400);
            $table->integer('checkout')->default(1000);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('booking_policies');
    }
};
