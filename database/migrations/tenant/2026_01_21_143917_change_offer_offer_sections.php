<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // Check if the table exists
        if (Schema::hasTable('offer_offer_sections')) {
            // Drop pagebreak and title columns if they exist
            Schema::table('offer_offer_sections', function (Blueprint $table) {
                if (Schema::hasColumn('offer_offer_sections', 'pagebreak')) {
                    $table->dropColumn('pagebreak');
                }
                if (Schema::hasColumn('offer_offer_sections', 'title')) {
                    $table->dropColumn('title');
                }
            });

            // For SQLite, we need to recreate the table to change column types
            if (DB::getDriverName() === 'sqlite') {
                // Get all data from the table
                $data = DB::table('offer_offer_sections')->get();

                // Drop the table
                Schema::drop('offer_offer_sections');

                // Recreate the table with the correct column types
                Schema::create('offer_offer_sections', function (Blueprint $table) {
                    $table->id();
                    $table->unsignedBigInteger('offer_id');
                    $table->unsignedBigInteger('section_id');
                    $table->text('content')->nullable();
                    $table->integer('pos')->default(0);
                    $table->timestamps();

                    // Add foreign keys
                    $table->foreign('section_id')->references('id')->on('offer_sections');
                    $table->foreign('offer_id')->references('id')->on('offers')->cascadeOnDelete();

                    // Add pagebreak enum
                    $table->enum('pagebreak', ['after', 'before', 'both', 'none'])->default('none');
                });

                // Restore the data
                foreach ($data as $row) {
                    DB::table('offer_offer_sections')->insert([
                        'id' => $row->id,
                        'offer_id' => $row->offer_id,
                        'section_id' => $row->section_id,
                        'content' => $row->content,
                        'pos' => $row->pos,
                        'created_at' => $row->created_at,
                        'updated_at' => $row->updated_at,
                    ]);
                }
            } else {
                // For other databases, use the original approach
                DB::statement('ALTER TABLE offer_offer_sections MODIFY section_id BIGINT UNSIGNED NOT NULL');
                DB::statement('ALTER TABLE offer_offer_sections MODIFY offer_id BIGINT UNSIGNED NOT NULL');

                Schema::table('offer_offer_sections', function (Blueprint $table) {
                    // Add foreign keys
                    $table->foreign('section_id')->references('id')->on('offer_sections');
                    $table->foreign('offer_id')->references('id')->on('offers')->cascadeOnDelete();

                    // Add pagebreak enum
                    $table->enum('pagebreak', ['after', 'before', 'both', 'none'])->default('none');
                });
            }
        }
    }
};
