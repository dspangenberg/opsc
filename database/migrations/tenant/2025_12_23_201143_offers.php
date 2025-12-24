<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();

            $table->integer('contact_id');
            $table->integer('project_id');
            $table->integer('offer_number')->nullable()->default(0)->unique();
            $table->date('issued_on');
            $table->date('valid_until')->nullable();
            $table->boolean('is_draft')->default(false);
            $table->string('address')->nullable();
            $table->dateTime('sent_at')->nullable();
            $table->unsignedBigInteger('tax_id')->default(1)->index('invoices_tax_id_foreign');
            $table->text('additional_text')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('');
    }
};
