<?php

namespace App\Services;

use App\Models\Tenant;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Ploi\Ploi;

class PloiService
{
    private int $serverId;

    private string $token;

    private string $backupProfileId;

    private string $baseUrl;

    private Tenant $tenant;

    private Ploi $ploi;

    public function __construct()
    {

        $this->token = config('services.ploi.access_token');

        $this->ploi = new Ploi($this->token);

        $this->serverId = config('services.ploi.server_id');
        $this->backupProfileId = config('services.ploi.backup_profile_id');
        $this->baseUrl = config('services.ploi.base_url');
        if (tenant()) {
            $this->tenant = tenant();
        }
    }

    public function setTenant(string $tenantId): PloiService
    {
        $this->tenant = Tenant::find($tenantId);

        return $this;
    }

    /**
     * @throws ConnectionException
     */
    public function acknowledgeDatabase(Tenant $tenant): void
    {

        $result = $this->ploi->servers($this->serverId)->databases()->acknowledge($tenant->tenancy_db_name);

        $databaseId = $result->getJson()->data->id;

        $tenant->update([
            'ploi_database_id' => $databaseId,
        ]);

        // sleep(60);
        $this->createDatabaseBackup($databaseId, $tenant->id);

    }

    /**
     * @throws ConnectionException
     */
    public function createDatabaseBackup(int $databaseId, string $tenantId): void
    {

        $response = Http::withToken($this->token)->asJson()
            ->post("$this->baseUrl/backups/database", [
                'backup_configuration' => $this->backupProfileId,
                'server' => $this->serverId,
                'databases' => [$databaseId],
                'path' => 'backupfiles/ooboo.cloud/tenants',
                'keep_backup_amount' => 3,
                'custom_name' => "tenant-$tenantId",
                'interval' => 0,
            ]
            );

        dump($response->status());
        dump($response->json()); // dump response for debugging purposes
    }

    /**
     * @throws ConnectionException
     */
    public function forgetDatabase(string $databaseName): void
    {
        Http::withToken($this->token)->asJson()
            ->delete("https://ploi.io/api/servers/$this->serverId/databases/$databaseName/forget");
    }

    /*
private function getDomain(Domain $domain): string
{

    $this->isSubomain = false;
    if (Str::substrCount($domain->domain, '.')) {
        $this->isSubomain = true;
        return str_replace('https://', '', Env('APP_URL'));
    }

    return $domain->domain;
}

private function isSubdomain()
{
    return $this->isSubdomain;
}


public function addDomain(Domain $domain): bool

    /*
    if ($domain->isSubdomain() || !$this->token) {
        return false;
    }

    if (gethostbyname($domain->domain) !== gethostbyname(Domain::
        domainFromSubdomain(tenant()->fallback_domain->domain))) {
        return false;
    }

    Http::withToken($this->token)->asJson()
        ->post("https://ploi.io/api/servers/{$this->serverId}/sites/{$this->site}/tenants", [
                'tenants' => [$domain->domain],
            ]
        );

    return true;
}
*/

}
