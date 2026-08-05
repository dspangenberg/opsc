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

ENV DEBIAN_FRONTEND=noninteractive

# PDF/OCR/Print-Werkzeuge
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ghostscript \
        tesseract-ocr \
        tesseract-ocr-eng \
        tesseract-ocr-deu \
        ocrmypdf \
        weasyprint \
        fonts-dejavu-core \
        xz-utils \
        git \
    && rm -rf /var/lib/apt/lists/*

# pdfcpu (nicht in Debian-Repos) – offizielles Release-Binary
ARG PDFCPU_VERSION=0.14.0
RUN set -eux; \
    case "${TARGETARCH}" in \
        amd64) PDFCPU_ARCH="x86_64" ;; \
        arm64) PDFCPU_ARCH="arm64" ;; \
        *) echo "Unsupported architecture: ${TARGETARCH}" >&2; exit 1 ;; \
    esac; \
    curl -fsSL "https://github.com/pdfcpu/pdfcpu/releases/download/v${PDFCPU_VERSION}/pdfcpu_${PDFCPU_VERSION}_Linux_${PDFCPU_ARCH}.tar.xz" \
        | tar -xJ -C /usr/local/bin pdfcpu; \
    chmod +x /usr/local/bin/pdfcpu

# ext-imagick (Pflicht-Abhängigkeit von spatie/pdf-to-image)
RUN install-php-extensions imagick

# ImageMagick-Policy: PDF-Lesen erlauben (Debian blockiert es standardmäßig)
RUN if [ -f /etc/ImageMagick-6/policy.xml ]; then \
        sed -i 's|<policy domain="coder" rights="none" pattern="PDF" />|<policy domain="coder" rights="read" pattern="PDF" />|' /etc/ImageMagick-6/policy.xml; \
    fi

# Eigene One-shot-Startskripte (Storage-Skelett, läuft vor nginx/php-fpm)
COPY --chmod=755 ./docker/entrypoint.d/ /etc/entrypoint.d/

# Anwendung inkl. Storage-Skelett (www-data-Besitzer) ins Image kopieren.
# Ein leeres Coolify-Volume unter /var/www/html/storage wird beim ersten
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
# sie wird nicht persistiert – zur Laufzeit gilt die echte Key aus Coolify.
RUN APP_KEY="base64:$(openssl rand -base64 32)" composer install --no-dev --prefer-dist --no-interaction --no-progress --optimize-autoloader \
    && APP_KEY="base64:$(openssl rand -base64 32)" php artisan storage:link

# Frontend-Assets aus der Node-Build-Stufe
COPY --from=node-build --chown=www-data:www-data /app/public/build /var/www/html/public/build

USER www-data
