<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bank_accounts', function (Blueprint $table) {
            $table->boolean('is_default')->default(false);
            $table->boolean('is_paypal')->default(false);
            $table->boolean('is_closed')->default(false);
            $table->string('prefix')->change()->nullable();
            $table->integer('bookkeeping_account_id')->change()->nullable();
            $table->string('bank_code')->change()->nullable();
            $table->string('iban')->change()->nullable();
            $table->string('bic')->change()->nullable();
            $table->string('bic')->change()->nullable();
            $table->integer('pos')->change()->default(99);
            $table->string('email')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('bank_accounts', function (Blueprint $table) {
            $table->dropColumn('is_default');
            $table->dropColumn('is_paypal');
            $table->dropColumn('is_closed');
            $table->dropColumn('email');
        });
    }
};
