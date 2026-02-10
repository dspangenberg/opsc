<?php

namespace Tests;

use App\Models\Tenant;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use RefreshDatabase;

    protected $tenant;

    protected function setUp(): void
    {
        parent::setUp();

        // Create a tenant for testing
        $this->tenant = Tenant::create([
            'id' => 'test-tenant-'.uniqid(),
            'organisation' => 'Test Organization',
        ]);
        $this->tenant->domains()->create(['domain' => 'test-tenant.localhost']);

        // Initialize tenancy context
        tenancy()->initialize($this->tenant);

        // Create cost_centers table manually for tests
        if (! \Illuminate\Support\Facades\Schema::hasTable('cost_centers')) {
            \Illuminate\Support\Facades\Schema::create('cost_centers', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->id();
                $table->string('name');
                $table->foreignId('bookkeeping_account_id')->nullable();
                $table->timestamps();
            });
        }

        // Create contacts table manually for tests
        if (! \Illuminate\Support\Facades\Schema::hasTable('contacts')) {
            \Illuminate\Support\Facades\Schema::create('contacts', function (\Illuminate\Database\Schema\Blueprint $table) {
                $table->bigIncrements('id');
                $table->integer('company_id')->nullable()->default(0);
                $table->boolean('is_org')->default(false);
                $table->string('name');
                $table->integer('title_id')->nullable()->default(0);
                $table->integer('salutation_id')->nullable()->default(0);
                $table->string('first_name')->nullable();
                $table->string('position')->nullable();
                $table->string('department')->nullable();
                $table->string('short_name')->nullable();
                $table->string('ref')->nullable();
                $table->integer('catgory_id')->nullable()->default(0);
                $table->boolean('is_debtor')->nullable()->default(false);
                $table->boolean('is_creditor')->nullable()->default(false);
                $table->integer('debtor_number')->nullable();
                $table->integer('creditor_number')->nullable();
                $table->boolean('is_archived')->nullable()->default(false);
                $table->string('archived_reason')->nullable();
                $table->boolean('has_dunning_block')->nullable()->default(false);
                $table->integer('payment_deadline_id')->nullable()->default(0);
                $table->integer('tax_id')->nullable()->default(0);
                $table->decimal('hourly')->nullable()->default(0);
                $table->string('register_court')->nullable();
                $table->string('register_number')->nullable();
                $table->string('vat_id')->nullable();
                $table->string('website')->nullable();
                $table->text('note')->nullable();
                $table->date('dob')->nullable();
                $table->softDeletes();
                $table->timestamps();
                $table->string('tax_number')->nullable();
                $table->string('receipts_ref')->nullable();
                $table->string('iban')->nullable();
                $table->integer('outturn_account_id')->default(0);
                $table->boolean('is_primary')->default(false);
                $table->string('paypal_email')->nullable();
                $table->string('cc_name')->nullable();
                $table->foreignId('cost_center_id')->nullable()->constrained('cost_centers');
            });
        }
    }

    protected function tearDown(): void
    {
        // End tenancy
        tenancy()->end();

        // Clean up tenant
        $this->tenant?->delete();

        parent::tearDown();
    }
}
