<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inboxes', function (Blueprint $table) {
            $table->id();
$table->string('email_address')->nullable();
$table->string('name');
$table->string('is_default');
$table->json('allowed_senders');
$table->timestamps();
$table->softDeletes();//
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inboxes');
    }
};
