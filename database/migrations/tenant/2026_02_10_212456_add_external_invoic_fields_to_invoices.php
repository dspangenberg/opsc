<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->unsignedBigInteger('document_id')->nullable();
            $table->foreign('document_id')->references('id')->on('documents')->nullOnDelete();
            $table->boolean('is_external')->default(false);
        });
    }

    public function down(): void
    {
        Schema::table('invoices', function (Blueprint $table) {
            $table->dropForeign(['document_id']);
            $table->dropColumn('document_id');
            $table->dropColumn('is_external');
        });
    }
};
