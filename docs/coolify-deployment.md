# Coolify-Deployment opsc

Deployment der Laravel-App **opsc** (PHP 8.5) per Multi-Stage-Dockerfile auf
`serversideup/php:8.5-fpm-nginx`. Ersatz für das bisherige Scotty/Ploi-System.

## Architektur

| Ressource       | Basis                                    | Port | Aufgabe                                    |
| --------------- | ---------------------------------------- | ---- | ------------------------------------------ |
| App `opsc`      | Dockerfile → `serversideup/php:8.5-fpm-nginx` | 8080 | nginx + PHP-FPM, PDF/OCR-Binaries          |
| Reverb          | gleiche Ressource, `--entrypoint`-Override | 8080 | WebSocket-Server (`reverb:start`)          |
| Queue-Worker    | gleiche Ressource, `--entrypoint`-Override | –    | `queue:work`                                |
| MySQL           | Coolify-DB (8.x)                         | 3306 | zentrale DB + Tenant-DBs                   |
| Redis           | Coolify-DB                               | 6379 | Cache, Session, Queue, Broadcasting        |

Im Image enthalten (gebakene Binaries): ghostscript, tesseract (eng+deu),
ocrmypdf, weasyprint, pdfcpu (SHA-256-verifiziert), ext-imagick, Redis-Erweiterung
(vom Basisimage), Facit-Font-Setup.

## 0. Voraussetzungen

- Coolify-Git-Source für `github.com/dspangenberg/opsc`, Branch **`develop`**
  (Dockerfile liegt dort).
- Server-Firewall: nur 80/443 (+ SSH) offen.

## 1. Datenbank-Ressourcen

### MySQL
- **Databases → MySQL** anlegen, DB `opsc`, User/Pass generieren lassen.
- Wichtig (Multi-Tenancy, stancl/tenancy): Der DB-User benötigt
  **`CREATE DATABASE` / `DROP DATABASE`**-Rechte – Tenant-DBs werden zur
  Laufzeit angelegt.
- Optional: automatische Backups aktivieren.

### Redis
- **Databases → Redis** anlegen. Für Cache/Session/Queue/Broadcasting.

## 2. Application „opsc"

### Build
- Build Pack: **`dockerfile`**, Base Directory: **`/`**, Dockerfile: `Dockerfile`
- Branch: `develop`
- General-Tab: **Ports Exposes `8080`**, Domain der App (z. B.
  `app.twiceware-opsc.de`)

### Build-Variablen (Tab „Environment Variables" → Toggle „Build Variable")
Müssen gesetzt sein, **bevor** der erste Build läuft – sonst sind die VITE-Werte
leer in die Frontend-Assets gebacken.

```
VITE_APP_NAME=opsc
VITE_APP_URL=https://app.twiceware-opsc.de
VITE_APP_DATE_FORMAT=dd.MM.yyyy
VITE_APP_TIME_FORMAT=HH:mm:ss
VITE_APP_DATE_TIME_FORMAT=dd.MM.yyyy HH:mm
VITE_SENTRY_ENABLED=true
VITE_SENTRY_DNS=<sentry-dsn>
VITE_REVERB_APP_KEY=<reverb-app-key>
VITE_REVERB_HOST=ws.twiceware-opsc.de
VITE_REVERB_PORT=443
VITE_REVERB_SCHEME=https
```

(`VITE_APP_DATE_FORMAT` etc. je nach App-Konvention anpassen – es gelten die
Werte, die lokal in der Frontend-Entwicklung verwendet werden.)

### Laufzeit-Variablen
```ini
APP_NAME=opsc
APP_ENV=production
APP_KEY=<base64-key>
APP_DEBUG=false
APP_URL=https://app.twiceware-opsc.de
APP_TIMEZONE=UTC
APP_LOCALE=de
APP_MAINTENANCE_DRIVER=file

LOG_CHANNEL=stack
LOG_STACK=single
LOG_LEVEL=warning
LOG_VIEWER_ENABLED=false

DB_CONNECTION=mysql
DB_HOST=<mysql-hostname>
DB_PORT=3306
DB_DATABASE=opsc
DB_USERNAME=<user>
DB_PASSWORD=<pass>

SESSION_DRIVER=redis
SESSION_LIFETIME=120

BROADCAST_CONNECTION=reverb
FILESYSTEM_DISK=local
QUEUE_CONNECTION=redis
CACHE_STORE=redis

REDIS_CLIENT=phpredis
REDIS_HOST=<redis-hostname>
REDIS_PORT=6379
REDIS_PASSWORD=null

MAIL_MAILER=smtp
MAIL_HOST=<smtp-host>
MAIL_PORT=587
MAIL_USERNAME=<user>
MAIL_PASSWORD=<pass>
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=no-reply@twiceware-opsc.de
MAIL_FROM_NAME="${APP_NAME}"

REVERB_APP_ID=<app-id>
REVERB_APP_KEY=<app-key>
REVERB_APP_SECRET=<app-secret>
# Interne Bindung des Reverb-Prozesses:
REVERB_SERVER_HOST=0.0.0.0
REVERB_SERVER_PORT=8080
# Öffentliche Adresse (für Broadcasting-Konfiguration der App):
REVERB_HOST=ws.twiceware-opsc.de
REVERB_PORT=443
REVERB_SCHEME=https

SENTRY_LARAVEL_DSN=<sentry-dsn>
SENTRY_ENVIRONMENT=production
SENTRY_SAMPLE_RATE=1.0

# PDF-Verarbeitung (Binaries liegen auf dem PATH; explizite Pfade sind stabiler)
PDF_GHOSTSCRIPT_PATH=/usr/bin/gs
PDF_WEASYPRINT_PATH=/usr/bin/weasyprint
OCRMYPDF_PATH=/usr/bin/ocrmypdf
PDF_PDFCPU_PATH=/usr/local/bin/pdfcpu
PDF_PDFCPU_WATERMARK_FONT=Facit-Semibold
PDF_TERMS_DOCUMENT_ID=<optional>

CONVERSION_RATES_API_KEY=<optional>
CONVERSION_RATES_API_HOST=<optional>
GOTENBERG_URL=<optional>
```

### Storage & Fonts
- **Storage-Tab → Persistent Storage**: Volume-Mount auf **`/var/www/html/storage`**
  (wird beim ersten Start aus dem Image-Skelett befüllt, `www-data`-Owner).
- **Facit-Fonts**: die zwei proprietären TTFs (`facit-regular-webfont.ttf`,
  `facit-semibold-webfont.ttf`) in den Volume-Pfad
  `storage/system/fonts/` kopieren – per Coolify **File Manager** oder
  `docker cp`. Danach Container **einmal neu starten**: der Entrypoint
  (`docker/entrypoint.d/10-storage-init.sh`) installiert sie als
  pdfcpu-User-Fonts und aktualisiert den fontconfig-Cache für WeasyPrint.

### Post-Deployment & Scheduler
- **Advanced → Post-Deployment Command**:
  `php artisan migrate --force`
- **Scheduled Tasks**: Cron `* * * * *` → `php artisan schedule:run`

## 3. Reverb (eigene Ressource)

Zweite Application, gleiches Repo/Dockerfile/Branch.

- **Custom Docker Options** (General-Tab):
  ```
  --entrypoint "sh -c 'exec php artisan reverb:start --host=0.0.0.0 --port=8080'"
  ```
- Ports Exposes `8080`, Domain `ws.twiceware-opsc.de`
- Laufzeit-Variablen: `APP_KEY`, alle `REVERB_*`, `DB_*`/`REDIS_*` übernehmen
  (Reverb bootet Laravel; die `VITE_*`-Build-Variablen sind hier unnötig).
- Hinweis: Der `--entrypoint`-Override ersetzt den ServersideUp-Entrypoint –
  die `entrypoint.d`-Skripte laufen hier **nicht**. Unkritisch (Reverb braucht
  weder Storage-Skelett noch Fonts). Optional dieselbe Storage-Volume anbinden
  für gemeinsame Logs.

## 4. Queue-Worker

Dritte Ressource (Vorlage wie Reverb), **ohne** Domain.

- Custom Docker Options:
  ```
  --entrypoint "sh -c 'exec php artisan queue:work --sleep=3 --tries=3 --max-time=3600'"
  ```
- Resource-Limits setzen (RAM-schonend, z. B. Memory-Limit 1G auf einer
  Hetzner-8GB-Box). Für mehr Parallelität Ressource replizieren statt `numprocs`.

## 5. Domains & DNS

1. Ersten Build starten und Logs prüfen (Build-Stufen: node → apt/pdfcpu →
   composer; pdfcpu-SHA-256-Verifikation muss grün sein).
2. Erst nach grünem Build: Bestands-DNS auf die neue Server-IP umziehen
   (App-Domain und `ws.twiceware-opsc.de`), TLS über den Coolify-Proxy
   (Traefik) automatisch.

## 6. Verifikation (Coolify-Terminal)

```bash
pdfcpu fonts list            # Facit-Regular + Facit-Semibold
fc-match facit               # → Facit-Familie
ls -la public/storage        # Symlink → storage/app/public
php artisan about            # Umgebung/Versionen
```

Danach: Login, ein PDF erzeugen (Rechnung + Stamp), Realtime-Funktion testen.

## Troubleshooting

- **Build schlägt bei pdfcpu fehl** → Checksum-Download defekt/unpassend: nur
  bei Versionswechsel `PDFCPU_VERSION` und beide SHA-256 in der Dockerfile
  aktualisieren (Assets von `github.com/pdfcpu/pdfcpu/releases`).
- **`Facit-Semibold is unsupported`** → Fonts fehlen im Volume
  `storage/system/fonts/` oder Container wurde nicht neu gestartet
  (Entrypoint installiert sie).
- **WeasyPrint ohne Facit (Fallback-Serif)** → `fc-match facit` prüfen,
  `fc-cache -f` läuft im Entrypoint.
- **Tenant-DB-Anlage schlägt fehl** → MySQL-User hat kein `CREATE DATABASE`.
- **Session/Queue-Fehler** → `REDIS_CLIENT=phpredis` (Ext ist im Basisimage
  enthalten) und `REDIS_HOST` auf den Redis-Ressourcen-Namen prüfen.
