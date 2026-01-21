<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('offer_offer_sections', function (Blueprint $table) {
            // Drop pagebreak and title if they exist
            if (Schema::hasColumn('offer_offer_sections', 'pagebreak')) {
                $table->dropColumn('pagebreak');
            }
            if (Schema::hasColumn('offer_offer_sections', 'title')) {
                $table->dropColumn('title');
            }
        });

        // Change section_id type from string to bigInteger using raw SQL
        DB::statement('ALTER TABLE offer_offer_sections MODIFY section_id BIGINT UNSIGNED NOT NULL');

        // Change offer_id type from integer to bigInteger using raw SQL
        DB::statement('ALTER TABLE offer_offer_sections MODIFY offer_id BIGINT UNSIGNED NOT NULL');

        Schema::table('offer_offer_sections', function (Blueprint $table) {
            // Add foreign keys
            $table->foreign('section_id')->references('id')->on('offer_sections');
            $table->foreign('offer_id')->references('id')->on('offers')->cascadeOnDelete();

            // Add pagebreak enum
            $table->enum('pagebreak', ['after', 'before', 'both', 'none'])->default('none');
        });
    }
};
