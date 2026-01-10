<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->integer('manager_contact_id')->nullable()->change();
            $table->integer('invoice_contact_id')->nullable()->change();
            $table->integer('parent_project_id')->nullable()->change();
            $table->integer('manager_contact_id')->nullable()->change();
        });
    }

    public function down(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            //
        });
    }
};
