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
        Schema::create('projects', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->string('name');
            $table->integer('owner_contact_id');
            $table->integer('lead_user_id')->default(0);
            $table->integer('manager_contact_id')->default(0);
            $table->integer('invoice_contact_id')->default(0);
            $table->integer('project_category_id')->default(0);
            $table->integer('parent_project_id')->default(0);
            $table->boolean('is_archived')->default(false);
            $table->decimal('hourly');
            $table->decimal('budget_hours');
            $table->decimal('budget_costs');
            $table->string('budget_period', 1);
            $table->date('begin_on')->nullable();
            $table->date('end_on')->nullable();
            $table->string('website');
            $table->text('note');
            $table->json('avatar')->nullable();
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
