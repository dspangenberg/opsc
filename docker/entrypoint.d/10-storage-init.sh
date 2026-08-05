#!/bin/sh
set -e

APP_DIR="${APP_BASE_DIR:-/var/www/html}"
STORAGE="${APP_DIR}/storage"

# Laufzeit-Storage-Skelett (Volumes werden beim ersten Mount aus dem Image befüllt,
# dieser Script ergänzt fehlende Unterordner, z.B. bei Bind-Mounts).
mkdir -p \
    "${STORAGE}/app/public" \
    "${STORAGE}/framework/cache/data" \
    "${STORAGE}/framework/sessions" \
    "${STORAGE}/framework/testing" \
    "${STORAGE}/framework/views" \
    "${STORAGE}/logs" \
    "${STORAGE}/system/tmp" \
    "${STORAGE}/system/pdfs" \
    "${STORAGE}/system/invoices" \
    "${STORAGE}/system/receipts" \
    "${STORAGE}/system/fonts" \
    "${STORAGE}/system/letterheads" \
    "${STORAGE}/system/templates" \
    "${STORAGE}/system/cache"

# Proprietäre Facit-Fonts: per Coolify-Volume in "${STORAGE}/system/fonts" ablegen.
# 1) pdfcpu-User-Fonts installieren (für Text-Stamps, PostScript-Name "Facit-Semibold").
#    pdfcpu liest sein Config-Dir aus $HOME (hier /var/www via ENV HOME im Dockerfile).
if ls "${STORAGE}/system/fonts"/*.ttf >/dev/null 2>&1; then
    HOME="$(dirname "${APP_DIR}")" pdfcpu fonts install "${STORAGE}/system/fonts"/*.ttf >/dev/null || true
fi

# 2) fontconfig-Cache aktualisieren, damit WeasyPrint `font-family: facit` auflöst.
#    Läuft als www-data, daher per-User-Cache in $HOME (nicht /var/cache/fontconfig).
HOME="$(dirname "${APP_DIR}")" fc-cache -f >/dev/null 2>&1 || true

# Hinweis: Diese Skripte werden von ServersideUp in einer Subshell gesourced
# (`(. "$f")`); keine `exit`-Anweisungen verwenden, nur Guards gegen Abbruch.
