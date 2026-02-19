<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        // For SQLite, we need to recreate the table to drop foreign keys
        if (DB::getDriverName() === 'sqlite') {
            // Get all data from the table
            $data = DB::table('documents')->get();

            // Drop the table
            Schema::drop('documents');

            // Recreate the table with the new structure
            Schema::create('documents', function (Blueprint $table) {
                $table->id();
                $table->string('filename');
                $table->string('source_file')->nullable();
                $table->date('issued_on')->nullable();
                $table->date('received_on')->nullable();
                $table->unsignedBigInteger('sender_contact_id')->nullable();
                $table->unsignedBigInteger('receiver_contact_id')->nullable();
                $table->unsignedBigInteger('document_type_id')->nullable();
                $table->unsignedBigInteger('project_id')->nullable();
                $table->text('summary')->nullable();
                $table->text('fulltext')->nullable();
                $table->boolean('is_confirmed')->default(false);
                $table->boolean('is_pinned')->default(false);
                $table->boolean('is_hidden')->default(false);
                $table->boolean('is_inbound')->default(true);
                $table->timestamps();
                $table->softDeletes();

                // Add foreign keys
                $table->foreign('sender_contact_id')
                    ->references('id')
                    ->on('contacts')
                    ->nullOnDelete();
                $table->foreign('receiver_contact_id')
                    ->references('id')
                    ->on('contacts')
                    ->nullOnDelete();
                $table->foreign('document_type_id')
                    ->references('id')
                    ->on('document_types')
                    ->nullOnDelete();
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->restrictOnDelete();

                // Add fulltext index (only for non-SQLite drivers)
                if (DB::getDriverName() !== 'sqlite') {
                    $table->fulltext('fulltext');
                }
            });

            // Restore the data
            foreach ($data as $row) {
                DB::table('documents')->insert([
                    'id' => $row->id,
                    'filename' => $row->filename,
                    'source_file' => $row->source_file ?? null,
                    'issued_on' => $row->issued_on,
                    'received_on' => $row->received_on ?? null,
                    'sender_contact_id' => $row->contact_id,
                    'receiver_contact_id' => $row->receiver_contact_id ?? null,
                    'document_type_id' => $row->document_type_id,
                    'project_id' => $row->project_id,
                    'summary' => $row->description ?? $row->summary,
                    'fulltext' => $row->fulltext,
                    'is_confirmed' => $row->is_confirmed,
                    'is_pinned' => $row->is_pinned,
                    'is_hidden' => $row->is_hidden ?? false,
                    'is_inbound' => $row->is_inbound ?? true,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                    'deleted_at' => $row->deleted_at,
                ]);
            }
        } else {
            // For other databases, use the original approach
            Schema::table('documents', function (Blueprint $table) {
                $table->date('received_on')->nullable();

                $table->dropForeign('documents_contact_id_foreign');

                $table->renameColumn('contact_id', 'sender_contact_id');
                $table->foreign('sender_contact_id')
                    ->references('id')
                    ->on('contacts')
                    ->nullOnDelete();

                $table->string('source_file')->nullable();
                $table->boolean('is_hidden')->default(false);
                $table->boolean('is_inbound')->default(true);

                $table->unsignedBigInteger('receiver_contact_id')->nullable();
                $table->foreign('receiver_contact_id')
                    ->references('id')
                    ->on('contacts')
                    ->nullOnDelete();

                $table->fulltext('fulltext');
                $table->renameColumn('description', 'summary');
            });
        }
    }

    public function down(): void
    {
        // For SQLite, we need to recreate the table to drop foreign keys and fulltext
        if (DB::getDriverName() === 'sqlite') {
            // Get all data from the table
            $data = DB::table('documents')->get();

            // Drop the table
            Schema::drop('documents');

            // Recreate the table with the original structure
            Schema::create('documents', function (Blueprint $table) {
                $table->id();
                $table->string('filename');
                $table->string('title')->nullable();
                $table->string('label')->nullable();
                $table->string('mime_type')->nullable();
                $table->string('checksum')->nullable();
                $table->unsignedBigInteger('file_size')->nullable();
                $table->unsignedBigInteger('pages')->nullable();
                $table->string('reference')->nullable();
                $table->date('file_created_at')->nullable();
                $table->date('sent_on')->nullable();
                $table->date('issued_on')->nullable();
                $table->unsignedBigInteger('contact_id')->nullable();
                $table->unsignedBigInteger('document_type_id')->nullable(); // Changed to nullable
                $table->unsignedBigInteger('project_id')->nullable();
                $table->text('description')->nullable();
                $table->text('fulltext')->nullable();
                $table->boolean('is_confirmed')->default(false);
                $table->boolean('is_pinned')->default(false);
                $table->timestamps();
                $table->softDeletes();

                // Add foreign keys
                $table->foreign('contact_id')
                    ->references('id')
                    ->on('contacts')
                    ->nullOnDelete();
                $table->foreign('document_type_id')
                    ->references('id')
                    ->on('document_types')
                    ->nullOnDelete();
                $table->foreign('project_id')
                    ->references('id')
                    ->on('projects')
                    ->restrictOnDelete();

                // Add fulltext index (only for non-SQLite drivers)
                if (DB::getDriverName() !== 'sqlite') {
                    $table->fulltext('fulltext');
                }
            });

            // Restore the data
            foreach ($data as $row) {
                DB::table('documents')->insert([
                    'id' => $row->id,
                    'filename' => $row->filename,
                    'title' => $row->title ?? null,
                    'label' => $row->label ?? null,
                    'mime_type' => $row->mime_type ?? null,
                    'checksum' => $row->checksum ?? null,
                    'file_size' => $row->file_size ?? null,
                    'pages' => $row->pages ?? null,
                    'reference' => $row->reference ?? null,
                    'file_created_at' => $row->file_created_at ?? null,
                    'sent_on' => $row->sent_on ?? null,
                    'issued_on' => $row->issued_on,
                    'contact_id' => $row->sender_contact_id ?? $row->contact_id,
                    'document_type_id' => $row->document_type_id,
                    'project_id' => $row->project_id,
                    'description' => $row->summary ?? $row->description,
                    'fulltext' => $row->fulltext,
                    'is_confirmed' => $row->is_confirmed,
                    'is_pinned' => $row->is_pinned,
                    'created_at' => $row->created_at,
                    'updated_at' => $row->updated_at,
                    'deleted_at' => $row->deleted_at,
                ]);
            }
        } else {
            // For other databases, use the original approach
            Schema::table('documents', function (Blueprint $table) {
                $table->dropColumn('received_on');
                $table->dropForeign('documents_sender_contact_id_foreign');
                $table->renameColumn('sender_contact_id', 'contact_id');
                $table->foreign('contact_id')
                    ->references('id')
                    ->on('contacts')
                    ->nullOnDelete();
                $table->dropForeign('documents_receiver_contact_id_foreign');
                $table->dropColumn('receiver_contact_id');
                $table->dropColumn('source_file');
                $table->dropFullText('documents_fulltext_fulltext');
                $table->renameColumn('summary', 'description');
                $table->dropColumn('is_hidden');
                $table->dropColumn('is_inbound');
            });
        }
    }
};
