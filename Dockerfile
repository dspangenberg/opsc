# syntax=docker/dockerfile:1

# =============================================================
# Stage 1: Frontend-Build (pnpm / Vite / tsc)
# =============================================================
FROM node:26 AS node-build

WORKDIR /app

ARG VITE_APP_NAME
ARG VITE_APP_URL
ARG VITE_APP_DATE_FORMAT
ARG VITE_APP_TIME_FORMAT
ARG VITE_APP_DATE_TIME_FORMAT
ARG VITE_SENTRY_ENABLED
ARG VITE_SENTRY_DNS
ARG VITE_REVERB_APP_KEY
ARG VITE_REVERB_HOST
ARG VITE_REVERB_PORT
ARG VITE_REVERB_SCHEME

ENV VITE_APP_NAME=${VITE_APP_NAME} \
    VITE_APP_URL=${VITE_APP_URL} \
    VITE_APP_DATE_FORMAT=${VITE_APP_DATE_FORMAT} \
    VITE_APP_TIME_FORMAT=${VITE_APP_TIME_FORMAT} \
    VITE_APP_DATE_TIME_FORMAT=${VITE_APP_DATE_TIME_FORMAT} \
    VITE_SENTRY_ENABLED=${VITE_SENTRY_ENABLED} \
    VITE_SENTRY_DNS=${VITE_SENTRY_DNS} \
    VITE_REVERB_APP_KEY=${VITE_REVERB_APP_KEY} \
    VITE_REVERB_HOST=${VITE_REVERB_HOST} \
    VITE_REVERB_PORT=${VITE_REVERB_PORT} \
    VITE_REVERB_SCHEME=${VITE_REVERB_SCHEME}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN corepack enable \
    && pnpm install --frozen-lockfile

COPY . .
RUN pnpm run build

# =============================================================
# Stage 2: Runtime (PHP 8.5 FPM + NGINX)
# =============================================================
FROM serversideup/php:8.5-fpm-nginx

USER root

ENV DEBIAN_FRONTEND=noninteractive \
    HOME=/var/www

# PDF/OCR/Print-Werkzeuge (fontconfig für fc-cache/WeasyPrint-Font-Auflösung)
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ghostscript \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-deu \
        ocrmypdf \
        weasyprint \
        fonts-dejavu-core \
        fontconfig \
        xz-utils \
        git \
    && rm -rf /var/lib/apt/lists/*

# pdfcpu (nicht in Debian-Repos) – offizielles Release-Binary.
# Download temporär, SHA-256-Verifikation pro TARGETARCH, dann erst entpacken.
ARG PDFCPU_VERSION=0.14.0
ARG TARGETARCH
RUN set -eux; \
    case "${TARGETARCH}" in \
        amd64) PDFCPU_ARCH="x86_64"; PDFCPU_SHA256="a892e89a408613fff8a45edfa97e030a2d00e06f6c9d520087d859d389686518" ;; \
        arm64) PDFCPU_ARCH="arm64"; PDFCPU_SHA256="339c647032629021921a4864255bdd67062c6ea8bd5ed08b9a6cbd69be5f752d" ;; \
        *) echo "Unsupported architecture: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl -fsSL -o /tmp/pdfcpu.tar.xz "https://github.com/pdfcpu/pdfcpu/releases/download/v${PDFCPU_VERSION}/pdfcpu_${PDFCPU_VERSION}_Linux_${PDFCPU_ARCH}.tar.xz"; \
    echo "${PDFCPU_SHA256}  /tmp/pdfcpu.tar.xz" | sha256sum -c -; \
    tar -xJ -C /usr/local/bin -f /tmp/pdfcpu.tar.xz --strip-components=1 --no-same-owner "pdfcpu_${PDFCPU_VERSION}_Linux_${PDFCPU_ARCH}/pdfcpu"; \
    rm /tmp/pdfcpu.tar.xz; \
    chmod +x /usr/local/bin/pdfcpu

# ext-imagick (Pflicht-Abhängigkeit von spatie/pdf-to-image)
RUN install-php-extensions imagick

# ImageMagick-Policy: PDF-Lesen erlauben (Debian blockiert es standardmäßig)
RUN if [ -f /etc/ImageMagick-6/policy.xml ]; then \
        sed -i 's|<policy domain="coder" rights="none" pattern="PDF" />|<policy domain="coder" rights="read" pattern="PDF" />|' /etc/ImageMagick-6/policy.xml; \
    fi

# Eigene One-shot-Startskripte (Storage-Skelett, läuft vor nginx/php-fpm)
COPY --chmod=755 ./docker/entrypoint.d/ /etc/entrypoint.d/

# fontconfig: Facit-Fonts aus dem Storage-Volume als System-Schriftregister
COPY --chmod=644 ./docker/fontconfig/99-opsc-fonts.conf /etc/fonts/conf.d/99-opsc-fonts.conf

# s6-langlaufende Prozesse (gleicher Container wie nginx/php-fpm):
# Reverb (WebSocket), Queue-Worker und Scheduler. Registrierung über
# user/contents.d, Start als www-data.
COPY --chmod=755 ./docker/s6-rc.d/ /etc/s6-overlay/s6-rc.d/

# Nginx: /apps-WebSocket-Endpunkt an den lokalen Reverb-Server (8081) proxen.
# Wird vom Basis-Image per `include /etc/nginx/server-opts.d/*.conf` in den
# Server-Block eingebunden.
COPY --chmod=644 ./docker/nginx/server-opts.d/reverb.conf /etc/nginx/server-opts.d/reverb.conf

# Anwendung inkl. Storage-Skelett (www-data-Besitzer) ins Image kopieren.
# Ein leeres Dokku-Volume unter /var/www/html/storage wird beim ersten
# Mount automatisch mit diesem Skelett inkl. korrekter Rechte befüllt.
WORKDIR /var/www/html
COPY --chown=www-data:www-data . /var/www/html

USER root
RUN mkdir -p \
        storage/app/public \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/testing \
        storage/framework/views \
        storage/logs \
        storage/system/tmp \
        storage/system/pdfs \
        storage/system/invoices \
        storage/system/receipts \
        storage/system/fonts \
        storage/system/letterheads \
        storage/system/templates \
        storage/system/cache \
    && chown -R www-data:www-data /var/www/html/storage

USER www-data

# Composer-Abhängigkeiten (ohne Dev-Pakete). Die temporäre APP_KEY aus
# /dev/urandom nur fuer den Build (package:discover/storage:link booten die App),
# sie wird nicht persistiert – zur Laufzeit gilt die echte Key aus Dokku-Config.
RUN APP_KEY="base64:$(openssl rand -base64 32)" composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader \
    && APP_KEY="base64:$(openssl rand -base64 32)" php artisan storage:link

# Frontend-Assets aus der Node-Build-Stufe
COPY --from=node-build --chown=www-data:www-data /app/public/build /var/www/html/public/build

USER www-data
