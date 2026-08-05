#!/usr/bin/env bash
# Einmalige Dokku-Einrichtung für opsc. Auf dem Server als root ausführen:
#   scp deploy/.env.production.deploy ...  # oder Datei per ssh ablegen
#   ssh root@SERVER 'bash -s' < deploy/bootstrap.sh
#
# Voraussetzungen: Dokku ist installiert und erreichbar (dokku --version).
# Werte kommen aus deploy/.env.production (Kopie der .example).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.production"
if [ -f "${ENV_FILE}" ]; then
    set -a
    # shellcheck disable=SC1090
    . "${ENV_FILE}"
    set +a
fi

: "${APP_NAME:=opsc}"
: "${DOMAIN:?DOMAIN in deploy/.env.production setzen}"
: "${LE_EMAIL:?LE_EMAIL in deploy/.env.production setzen}"
: "${APP_KEY:?APP_KEY in deploy/.env.production setzen}"
: "${REVERB_APP_ID:?REVERB_APP_ID setzen}"
: "${REVERB_APP_KEY:?REVERB_APP_KEY setzen}"
: "${REVERB_APP_SECRET:?REVERB_APP_SECRET setzen}"
: "${HETZNER_API_TOKEN:?HETZNER_API_TOKEN (Hetzner DNS API) setzen}"

command -v dokku >/dev/null || { echo "dokku nicht gefunden – Installation prüfen."; exit 1; }

# 1) Plugins (idempotent)
dokku plugin:install https://github.com/dokku/dokku-mysql.git mysql || true
dokku plugin:install https://github.com/dokku/dokku-redis.git redis || true
dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git letsencrypt || true

# 2) App + Datenbankdienste
dokku apps:create "${APP_NAME}"
dokku mysql:create "${APP_NAME}" || true
dokku redis:create "${APP_NAME}" || true
dokku mysql:link "${APP_NAME}" "${APP_NAME}"
dokku redis:link "${APP_NAME}" "${APP_NAME}"

DB_URL="$(dokku config:get "${APP_NAME}" DATABASE_URL)"

# 2b) Tenant-Datenbanken (stancl/tenancy): Das Link-User darf nur auf die eigene
#     DB zu; es muss Tenant-DBs (Prefix aus TENANCY_DB_PREFIX) anlegen/droppen können.
DB_USER="${DB_URL#mysql://}"
DB_USER="${DB_USER%%:*}"
TENANCY_DB_PREFIX="${TENANCY_DB_PREFIX:-opsc-}"
dokku mysql:connect "${APP_NAME}" <<SQL
GRANT CREATE, DROP, ALTER, INDEX, REFERENCES, SELECT, INSERT, UPDATE, DELETE, LOCK TABLES, EXECUTE, TRIGGER ON \`${TENANCY_DB_PREFIX}%\`.* TO '${DB_USER}'@'%';
FLUSH PRIVILEGES;
SQL

# 3) Laufzeit-Config (MySQL/Redis kommen aus den Links, s. DATABASE_URL/REDIS_URL)
dokku config:set "${APP_NAME}" \
    APP_ENV=production \
    APP_KEY="${APP_KEY}" \
    APP_URL="https://${DOMAIN}" \
    APP_DEBUG=false \
    APP_TIMEZONE="${APP_TIMEZONE:-Europe/Berlin}" \
    APP_LOCALE="${APP_LOCALE:-de}" \
    LOG_LEVEL="${LOG_LEVEL:-warning}" \
    DB_URL="${DB_URL}" \
    SESSION_DRIVER=redis \
    CACHE_STORE=redis \
    QUEUE_CONNECTION=redis \
    BROADCAST_CONNECTION=reverb \
    REDIS_CLIENT=phpredis \
    REVERB_APP_ID="${REVERB_APP_ID}" \
    REVERB_APP_KEY="${REVERB_APP_KEY}" \
    REVERB_APP_SECRET="${REVERB_APP_SECRET}" \
    REVERB_HOST="${REVERB_HOST:-${DOMAIN}}" \
    REVERB_PORT=443 \
    REVERB_SCHEME=https \
    REVERB_SERVER_HOST=127.0.0.1 \
    REVERB_SERVER_PORT=8081 \
    PDF_GHOSTSCRIPT_PATH=/usr/bin/gs \
    PDF_WEASYPRINT_PATH=/usr/bin/weasyprint \
    OCRMYPDF_PATH=/usr/bin/ocrmypdf \
    PDF_PDFCPU_PATH=/usr/local/bin/pdfcpu \
    PDF_PDFCPU_WATERMARK_FONT=Facit-Semibold \
    PDF_TERMS_DOCUMENT_ID="${PDF_TERMS_DOCUMENT_ID:-}" \
    SENTRY_LARAVEL_DSN="${SENTRY_LARAVEL_DSN:-}" \
    SENTRY_ENVIRONMENT=production \
    MAIL_MAILER="${MAIL_MAILER:-log}" \
    MAIL_HOST="${MAIL_HOST:-}" \
    MAIL_PORT="${MAIL_PORT:-587}" \
    MAIL_USERNAME="${MAIL_USERNAME:-}" \
    MAIL_PASSWORD="${MAIL_PASSWORD:-}" \
    MAIL_ENCRYPTION="${MAIL_ENCRYPTION:-tls}" \
    MAIL_FROM_ADDRESS="${MAIL_FROM_ADDRESS:-no-reply@twiceware-opsc.de}" \
    MAIL_FROM_NAME="${MAIL_FROM_NAME:-opsc}"

# 4) Build-Args: VITE_* werden beim Docker-Build in die JS-Assets kompiliert.
#    Dokku reicht Config-Variablen NICHT automatisch an docker build weiter.
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_APP_NAME=${VITE_APP_NAME:-opsc}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_APP_URL=${VITE_APP_URL:-https://${DOMAIN}}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_APP_DATE_FORMAT=${VITE_APP_DATE_FORMAT:-}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_APP_TIME_FORMAT=${VITE_APP_TIME_FORMAT:-}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_APP_DATE_TIME_FORMAT=${VITE_APP_DATE_TIME_FORMAT:-}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_SENTRY_ENABLED=${VITE_SENTRY_ENABLED:-false}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_SENTRY_DNS=${VITE_SENTRY_DNS:-}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_REVERB_APP_KEY=${REVERB_APP_KEY}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_REVERB_HOST=${REVERB_HOST:-${DOMAIN}}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_REVERB_PORT=${VITE_REVERB_PORT:-443}"
dokku docker-options:add "${APP_NAME}" build --build-arg "VITE_REVERB_SCHEME=${VITE_REVERB_SCHEME:-https}"

# 5) Persistenter Storage (Facit-Fonts später nach system/fonts legen)
dokku storage:mount "${APP_NAME}" "/var/lib/dokku/data/${APP_NAME}-storage:/var/www/html/storage"

# 6) Proxy: Host-Ports 80/443 → Container-Port 8080 (nginx)
dokku proxy:ports-set "${APP_NAME}" http:80:8080 https:443:8080
dokku domains:set "${APP_NAME}" "${DOMAIN}"
dokku domains:add "${APP_NAME}" "*.${DOMAIN}"

# 7) TLS (Let's Encrypt) – Wildcard-Zertifikat via DNS-01 (Hetzner DNS API).
#    Voraussetzung: A-Record "${DOMAIN}" und Wildcard "*.${DOMAIN}" zeigen auf
#    diesen Server, sonst schlägt das Ausstellen fehl.
dokku letsencrypt:set --global email "${LE_EMAIL}"
dokku letsencrypt:set --global dns-provider hetzner
dokku letsencrypt:set --global dns-provider-HETZNER_API_TOKEN "${HETZNER_API_TOKEN}"
dokku letsencrypt:enable "${APP_NAME}"
dokku letsencrypt:cron-job --add

echo
echo "Einrichtung abgeschlossen. Deployment auslösen mit:"
echo "  git push dokku develop"
echo "oder per GitHub Actions (Push auf develop)."
