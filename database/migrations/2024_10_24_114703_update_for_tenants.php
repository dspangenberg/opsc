<?php

/*
 * ecting.core is licensed under the terms of the EUPL-1.2 license
 * Copyright (c) 2024-2025 by Danny Spangenberg (twiceware solutions e. K.)
 */

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->string('last_name');
            $table->string('first_name');
            $table->string('organisation');
            $table->string('address')->nullable();
            $table->string('zip');
            $table->string('city');
            $table->bigInteger('country_id')->unsigned()->nullable();
            $table->bigInteger('salutation_id')->unsigned()->nullable();
            $table->bigInteger('title_id')->unsigned()->nullable();
            $table->string('website')->nullable();
            $table->string('subdomain')->nullable();
            $table->string('email')->nullable();
            $table->integer('otp')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('setuped')->nullable();
            $table->boolean('is_suspended')->default(false);
            $table->text('note')->nullable();
            $table->foreign('salutation_id')->references('id')->on('salutations')->onDelete('set null');
            $table->foreign('title_id')->references('id')->on('titles')->onDelete('set null');
            $table->foreign('country_id')->references('id')->on('countries')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('tenants', function (Blueprint $table) {
            $table->dropForeign(['salutation_id', 'title_id', 'country_id']);
            $table->dropColumn('last_name');
            $table->dropColumn('first_name');
            $table->dropColumn('organisation');
            $table->dropColumn('address');
            $table->dropColumn('zip');
            $table->dropColumn('city');
            $table->dropColumn('country_id');
            $table->dropColumn('salutation_id');
            $table->dropColumn('title_id');
            $table->dropColumn('website');
            $table->dropColumn('subdomain');
            $table->dropColumn('email');
            $table->dropColumn('otp');
            $table->dropColumn('email_verified_at');
            $table->dropColumn('setuped');
            $table->dropColumn('is_suspended');
            $table->dropColumn('note');
        });
    }
};
