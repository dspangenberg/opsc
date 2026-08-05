# Dokku-Deployment opsc

Deployment der Laravel-App **opsc** (PHP 8.5) auf einem eigenen Server mit
[Dokku](https://dokku.com/) + GitHub Actions. Ersetzt Coolify/Scotty.

## Architektur

Ein einziger Container (ServersideUp `8.5-fpm-nginx`), in dem s6 alle Prozesse
überwacht:

| Prozess   | s6-Service (`docker/s6-rc.d/`)        |
| --------- | ------------------------------------- |
| nginx+PHP | Basis-Image (Port 8080)               |
| Reverb    | `reverb` → `artisan reverb:start --host=127.0.0.1 --port=8081` |
| Queue     | `worker` → `artisan queue:work`       |
| Scheduler | `scheduler` → `artisan schedule:work` |

WebSocket: nginx reicht `/apps` per HTTP-Upgrade an Reverb (127.0.0.1:8081)
weiter – **eine Domain**, kein extra Port (`docker/nginx/server-opts.d/reverb.conf`).
Datenbank: MySQL-Plugin, Redis-Plugin (Laravel liest `DB_URL`/`REDIS_URL`).

## 0. Einmalig (Server + GitHub)

Server: Dokku installieren (z. B. `wget https://dokku.com/install/v0.40.0/bootstrap.sh -O - | bash`),
dann:

```sh
git clone https://github.com/dspangenberg/opsc.git /srv/apps/opsc
cd /srv/apps/opsc
cp deploy/.env.production.example deploy/.env.production   # Werte eintragen
./deploy/bootstrap.sh
```

`bootstrap.sh` liegt versioniert im jeweiligen App-Repo (weitere Anwendungen
bringen ihr eigenes Skript + `.env.production` mit, inkl. eigener
`APP_NAME`/Domain) und wird aus dem Repo-Verzeichnis gestartet. Es legt App +
MySQL/Redis an, verlinkt sie, setzt Config + die 11 `VITE_*`-Build-Args,
erteilt dem MySQL-User die Rechte für Tenant-DBs (`opsc-*`, stancl/tenancy),
mountet Storage und aktiviert Let's Encrypt.

**TLS-Wildcard**: Das Zertifikat deckt `DOMAIN` und `*.DOMAIN` ab (DNS-01 via
Hetzner DNS API, Token in `HETZNER_API_TOKEN`). Die zentrale App liegt auf
`twiceware-opsc.de`, Tenants unter `<slug>.twiceware-opsc.de`
(`twsek.twiceware-opsc.de` usw., siehe `StoreRegistrationCredentials`/
`PendingUserEmail`). Vor dem Bootstrap müssen beide DNS-Einträge
(`twiceware-opsc.de` **und** `*.twiceware-opsc.de`) als A-Record auf die
Server-IP zeigen – sonst schlägt das Ausstellen fehl.

GitHub-Reposettings:
- **Secret** `DOKKU_SSH_PRIVATE_KEY`: privater SSH-Key, dessen öffentlichen Teil
  du mit `dokku ssh-keys:add github-actions <pubkey>` auf dem Server registrierst
  (SSH-Zugang des `dokku`-Users, nur Deploy-Rechte).
- **Variable** `DOKKU_HOST`: Server-IP/-Hostname, z. B. `123.45.67.89`.

## 1. Deploy

Push auf `main` → `.github/workflows/deploy.yml` pusht per
`dokku/github-action` → Dokku baut das Image (Node-Stage → apt/pdfcpu → Composer)
und deployt. Migrationen laufen bei **jedem** Deploy automatisch über
`app.json` (`scripts.dokku.predeploy`, vor dem Containerstart).

## 2. Facit-Fonts

Einmalig in den Storage legen (danach Re-Deploy oder `dokku ps:restart opsc`):

```sh
scp facit-regular-webfont.ttf facit-semibold-webfont.ttf root@SERVER:/var/lib/dokku/data/opsc-storage/system/fonts/
```

Der Entrypoint (`docker/entrypoint.d/10-storage-init.sh`) installiert sie bei
jedem Containerstart als pdfcpu-User-Fonts und baut den fontconfig-Cache.

## 3. Verifikation

```sh
dokku ps:logs opsc                          # Logs (auch reverb/worker/scheduler)
dokku domains:report opsc                   # DOMAIN + *.DOMAIN
dokku letsencrypt:list                      # Zertifikat + Ablauf (Wildcard)
dokku run opsc pdfcpu fonts list            # Facit-Regular + Facit-Semibold
dokku run opsc fc-match facit
dokku run opsc ls -la public/storage        # Symlink → storage/app/public
```

## Betrieb

```sh
dokku ps:restart opsc          # Neustart (alle Prozesse)
dokku run opsc php artisan migrate --force
dokku run opsc php artisan config:cache     # Achtung: Env-Änderungen erfordern Neustart
dokku config:set opsc VAR=value             # Env ändern → Deploy/Neustart
dokku letsencrypt:auto-renew                # TLS-Renewal
dokku backup:export                         # Dokku-Backup
dokku mysql:backup opsc     # MySQL-Dump
dokku redis:info opsc
```

Hinweise:
- Env-Änderungen über `dokku config:set` starten die App automatisch neu.
- `queue:work --tries=3 --max-time=3600` → Worker läuft nach 1 h selbst neu
  (Memory-Leak-Schutz); s6 startet ihn bei Absturz automatisch.
- Mehrere Worker: s6-Nummern im Image (z. B. `worker`, `worker2`) hinzufügen –
  oder Replicas (`dokku ps:scale opsc` skaliert nur den Container, nicht die Prozesse).

## Troubleshooting

- **Deploy schlägt bei pdfcpu fehl** → nur bei Versionswechsel `PDFCPU_VERSION`
  und beide SHA-256 in der Dockerfile aktualisieren.
- **Zertifikat für Wildcard schlägt fehl** → `*.DOMAIN`-A-Record zeigt nicht auf
  den Server, oder `HETZNER_API_TOKEN` fehlt/wertlos; Token in der Hetzner-DNS-Zone
  prüfen (`dokku letsencrypt:report --global`), danach `dokku letsencrypt:enable opsc --force`.
- **`Facit-Semibold is unsupported`** → Fonts fehlen im Storage-Volume.
- **WeasyPrint ohne Facit** → `fc-match facit` prüfen.
- **WS verbindet nicht** → `dokku ps:logs opsc` für Reverb-Zeilen prüfen;
  `/apps` muss über den nginx-Proxy (nicht direkt 8081) erreichbar sein.
