<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('is_locked');
            $table->index('is_private');
            $table->index('is_transit');
            $table->index('contact_id');
            $table->index('bank_account_id');
            $table->index('org_category');
            $table->index('account_number');
            $table->index('name');
            $table->index('purpose');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex('transactions_is_locked_index');
            $table->dropIndex('transactions_is_private_index');
            $table->dropIndex('transactions_is_transit_index');
            $table->dropIndex('transactions_contact_id_index');
            $table->dropIndex('transactions_bank_account_id_index');
            $table->dropIndex('transactions_org_category_index');
            $table->dropIndex('transactions_account_number_index');
            $table->dropIndex('transactions_name_index');
            $table->dropIndex('transactions_purpose_index');
        });
    }
};
