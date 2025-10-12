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
        Schema::create('invoices', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->integer('contact_id');
            $table->integer('project_id');
            $table->integer('invoice_number')->nullable()->default(0)->unique();
            $table->date('issued_on');
            $table->date('due_on')->nullable();
            $table->boolean('dunning_block')->default(false);
            $table->boolean('is_draft')->default(false);
            $table->integer('type_id')->default(1);
            $table->string('service_provision')->nullable();
            $table->string('vat_id')->nullable();
            $table->string('address')->nullable();
            $table->integer('payment_deadline_id');
            $table->dateTime('sent_at')->nullable();
            $table->integer('legacy_id')->default(0);
            $table->timestamps();
            $table->unsignedBigInteger('number_range_document_numbers_id')->nullable()->unique();
            $table->date('service_period_begin')->nullable();
            $table->date('service_period_end')->nullable();
            $table->integer('invoice_contact_id')->default(0);
            $table->boolean('is_loss_of_receivables')->default(false);
            $table->boolean('is_recurring')->default(false);
            $table->integer('recurring_interval_days')->default(0);
            $table->date('recurring_begin_on')->nullable();
            $table->date('recurring_end_on')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable()->index('invoices_parent_id_foreign');
            $table->unsignedBigInteger('tax_id')->default(1)->index('invoices_tax_id_foreign');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
