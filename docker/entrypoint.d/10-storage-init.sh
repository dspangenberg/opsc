#!/bin/sh
set -e

APP_DIR="${APP_BASE_DIR:-/var/www/html}"
STORAGE="${APP_DIR}/storage"

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

# Hinweis: Kein `exit` verwenden – ServersideUp sourced diese Skripte,
# ein exit/return wuerde die gesamte Entrypoint-Kette abbrechen.
