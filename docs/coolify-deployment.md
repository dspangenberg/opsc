# Coolify-Deployment opsc

Deployment der Laravel-App **opsc** (PHP 8.5) per Docker-Compose als **eine**
Coolify-Ressource. Basis: Multi-Stage-Dockerfile auf
`serversideup/php:8.5-fpm-nginx`, Ersatz für das bisherige Scotty/Ploi-System.

## Architektur

`docker-compose.yml` im Repo definiert 7 Services – alle Laravel-Prozesse
laufen auf **demselben Image** (identische PHP-8.5-Runtime, kein
Versionskonflikt; Node `node:26` existiert nur in der Build-Stage für das
Frontend):

| Service    | Aufgabe                                         | Command-Override                    |
| ---------- | ----------------------------------------------- | ----------------------------------- |
| `app`      | nginx + PHP-FPM (Port 8080)                     | – (Image-Default)                   |
| `migrate`  | Einmal-Job `php artisan migrate --force`        | ja, `restart: "no"`                 |
| `reverb`   | WebSocket-Server                                | `reverb:start --port=8080`          |
| `worker`   | Queue-Worker (Memory-Limit 1G)                  | `queue:work --sleep=3 --tries=3`    |
| `scheduler`| `php artisan schedule:work` (läuft dauerhaft)   | ja                                  |
| `mysql`    | MySQL 8.4 (z. B. Image)                          | –                                   |
| `redis`    | Redis 7 (Cache/Session/Queue/Broadcasting)      | –                                   |

Im Image enthalten: ghostscript, tesseract (eng+deu), ocrmypdf, weasyprint,
pdfcpu (SHA-256-verifiziert), ext-imagick, Redis-Erweiterung (Basisimage),
Facit-Font-Setup.

## 0. Voraussetzungen

- Coolify-Git-Source für `github.com/dspangenberg/opsc` (GitHub App),
  Branch **`develop`**.
- Server-Firewall: nur 80/443 (+ SSH) offen.

## 1. Ressource anlegen (EIN Schritt statt drei Apps)

1. **Projects → + New** → Projekt `opsc`
2. Im Projekt **+ New** → **Docker Compose**
3. GitHub-Source wählen, Repo `opsc`, Branch `develop`
4. Compose-Datei bleibt `docker-compose.yml` (Repo-Root)

## 2. Umgebungsvariablen setzen

In der Compose-Ressource unter **Environment** eintragen – die Datei
interpoliert `${VAR}` (Pflicht-Variablen mit `:?` brechen den Deploy, wenn
fehlend). Die 11 `VITE_*`-Werte sind dort **Build-Variablen** und steuern die
Frontend-Assets.

```bash
# Pflicht (verhindern sonst den Start)
APP_KEY=base64:...
APP_URL=https://app.twiceware-opsc.de
DB_PASSWORD=<app-db-pass>
DB_ROOT_PASSWORD=<mysql-root-pass>
REVERB_APP_ID=...
REVERB_APP_KEY=...
REVERB_APP_SECRET=...
REVERB_HOST=ws.twiceware-opsc.de

# Build-Variablen (VITE_*)
VITE_APP_NAME=opsc
VITE_APP_URL=https://app.twiceware-opsc.de
VITE_APP_DATE_FORMAT=dd.MM.yyyy
VITE_APP_TIME_FORMAT=HH:mm:ss
VITE_APP_DATE_TIME_FORMAT=dd.MM.yyyy HH:mm
VITE_SENTRY_ENABLED=true
VITE_SENTRY_DNS=<sentry-dsn>
VITE_REVERB_APP_KEY=<= REVERB_APP_KEY>
VITE_REVERB_HOST=ws.twiceware-opsc.de
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https

# Optional
APP_TIMEZONE=Europe/Berlin
SENTRY_LARAVEL_DSN=<sentry-dsn>
MAIL_MAILER=smtp
MAIL_HOST=... MAIL_PORT=587 MAIL_USERNAME=... MAIL_PASSWORD=... MAIL_ENCRYPTION=tls
PDF_TERMS_DOCUMENT_ID=<optional>
```

Alle weiteren Env-Werte (DB_HOST, REDIS_*, QUEUE_*, PDF_*_PATH,
`PDF_PDFCPU_WATERMARK_FONT=Facit-Semibold`, REVERB_SERVER_*) sind bereits mit
Produktions-Defaults in `docker-compose.yml` hinterlegt.

## 3. Domains

- `app.twiceware-opsc.de` → Service **`app`**, Port **8080**
- `ws.twiceware-opsc.de` → Service **`reverb`**, Port **8080**

(Coolify-Proxy/Traefik terminiert TLS, `wss://` für Reverb automatisch.)

## 4. Storage & Fonts

- Volumes (`opsc-storage`, `opsc-mysql`, `opsc-redis`) sind in der Compose-
  Datei deklariert; Coolify zeigt sie unter **Storage** an (ggf. dort als
  persistent markieren).
- **Facit-Fonts** in den Volume-Pfad `opsc-storage` → `var/www/html/storage/
  system/fonts/` legen (`facit-regular-webfont.ttf`, `facit-semibold-
  webfont.ttf`) – per Coolify File Manager oder `docker cp`. Danach einmal neu
  deployen: der Entrypoint (`docker/entrypoint.d/10-storage-init.sh`) installiert
  sie als pdfcpu-User-Fonts und baut den fontconfig-User-Cache.

## 5. Deploy

- **Deploy** klicken. Ablauf: `migrate` läuft zuerst (wartet auf gesunden
  MySQL), erst danach startet `app`. Reverb/Worker/Scheduler starten parallel.
- Build-Logs prüfen: Node-Stage → apt/pdfcpu (SHA-256-Verify) → Composer.

## 6. DNS & Verifikation

1. Erst nach grünem Deploy die Bestands-DNS auf die neue Server-IP umziehen.
2. Verifikation im Coolify-Terminal (Service `app`):
   ```bash
   pdfcpu fonts list            # Facit-Regular + Facit-Semibold
   fc-match facit               # → Facit-Familie
   ls -la public/storage        # Symlink → storage/app/public
   php artisan about
   ```
3. Login, PDF (Rechnung + Stamp) erzeugen, Realtime-Funktion testen.

## Migrations & Änderungen

- **Migrationen** laufen automatisch über den `migrate`-Service bei jedem
  Deploy (idempotent).
- **Scheduler/Queue/Reverb** brauchen keine Coolify-Config – sie sind als
  Services in der Datei.

## Troubleshooting

- **Build scheitert bei pdfcpu** → nur bei Versionswechsel `PDFCPU_VERSION`
  und die beiden SHA-256 in der Dockerfile aktualisieren.
- **`Facit-Semibold is unsupported`** → Fonts fehlen im `opsc-storage`-Volume
  (`storage/system/fonts/`) oder noch kein Re-Deploy nach Upload.
- **WeasyPrint ohne Facit** → `fc-match facit` prüfen (fontconfig-User-Cache
  wird vom Entrypoint gebaut).
- **Tenant-DB-Anlage schlägt fehl** → `docker/initdb/10-grant-tenancy.sh`
  vergibt CREATE/DROP-Rechte nur beim ersten MySQL-Init (leeres Volume);
  bei bestehendem Volume manuell `GRANT CREATE, DROP ON *.* ...` ausführen.
- **`:?`-Fehler beim Deploy** → Pflicht-Env-Variable fehlt in Coolify.
- **Mehrere Worker** → Worker-Service in Coolify duplizieren (Replicas),
  nicht `numprocs`.
