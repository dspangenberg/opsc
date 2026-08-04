#!/usr/bin/env scotty

# Scotty.sh fuer twiceware-opsc.de (quantum-forge, dspangenberg/opsc).
# Deploy:  scotty run deploy
# Anderer Branch:  scotty run deploy --branch=develop
#
# Voraussetzungen (auf dem Server eingerichtet):
#   - Deploy-Key /home/twiceware/.ssh/id_ed25519_github ist als Deploy-Key
#     im GitHub-Repo dspangenberg/opsc hinterlegt. Das ist der server-seitige
#     Key, den Scotty fuer den GitHub-Clone nutzt - getrennt zu betrachten vom
#     Container-Hop (ssh zum Server) und dem lokalen SSH-Key des Entwicklers.
#   - twiceware darf per sudo das FPM-Pool-Update sowie Reverb- und Queue-Dienst neu starten.
#   - node/pnpm liegen als Wrapper in /usr/local/bin (LD_LIBRARY_PATH gesetzt).

# @servers local=127.0.0.1 remote=twiceware@77.42.67.43
# @macro deploy startDeployment cloneRepository runComposer buildAssets updateSymlinks migrateDatabase blessNewRelease cleanOldReleases

# @option branch=main

BASE_DIR="/home/twiceware/vhosts/twiceware-opsc.de/public_html"
RELEASES_DIR="$BASE_DIR/releases"
PERSISTENT_DIR="$BASE_DIR/persistent"
CURRENT_DIR="$BASE_DIR/current"
NEW_RELEASE_NAME=$(date +%Y%m%d-%H%M%S)
NEW_RELEASE_DIR="$RELEASES_DIR/$NEW_RELEASE_NAME"
REPOSITORY="dspangenberg/opsc"
GITHUB_DEPLOY_KEY="/home/twiceware/.ssh/id_ed25519_github"

# Validate the branch before it is used in any git command, so a malformed
# branch value can never be interpreted as extra arguments or options.
if ! git check-ref-format --branch "$BRANCH"; then
    echo "Invalid branch: $BRANCH" >&2
    exit 1
fi

# @task on:local
startDeployment() {
    set -e
    git checkout "$BRANCH"
    git pull origin "$BRANCH"
}

# @task on:remote
cloneRepository() {
    set -e
    [ -d "$RELEASES_DIR" ] || mkdir -p "$RELEASES_DIR"
    [ -d "$PERSISTENT_DIR" ] || mkdir -p "$PERSISTENT_DIR"
    [ -d "$PERSISTENT_DIR/storage" ] || mkdir -p "$PERSISTENT_DIR/storage"

    cd "$RELEASES_DIR"
    GIT_SSH_COMMAND="ssh -i $GITHUB_DEPLOY_KEY -o IdentitiesOnly=yes" \
        git clone --depth 1 --branch "$BRANCH" "git@github.com:$REPOSITORY" "$NEW_RELEASE_NAME"
}

# @task on:remote
runComposer() {
    set -e
    cd "$NEW_RELEASE_DIR"
    [ -r "$BASE_DIR/.env" ] || { echo "Missing readable .env at $BASE_DIR/.env" >&2; return 1; }
    ln -nfs "$BASE_DIR/.env" .env
    composer install --prefer-dist --no-dev -o
}

# @task on:remote
buildAssets() {
    set -e
    cd "$NEW_RELEASE_DIR"
    pnpm install --frozen-lockfile
    pnpm build
    rm -rf node_modules
}

# @task on:remote
updateSymlinks() {
    set -e
    rm -rf -- "$NEW_RELEASE_DIR/storage"
    cd "$NEW_RELEASE_DIR"
    ln -nfs "$PERSISTENT_DIR/storage" storage
}

# @task on:remote
migrateDatabase() {
    set -e
    cd "$NEW_RELEASE_DIR"
    php artisan migrate --force
    php artisan tenants:migrate --force
}

# @task on:remote
blessNewRelease() {
    set -e
    # Caches zuerst bauen, erst danach den neuen Release aktivieren.
    cd "$NEW_RELEASE_DIR"
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
    php artisan cache:clear

    ln -nfs "$NEW_RELEASE_DIR" "$CURRENT_DIR"

    sudo systemctl reload php8.5-fpm
    sudo systemctl restart reverb-twiceware.service
    sudo systemctl restart queue-twiceware.service
}

# @task on:remote
cleanOldReleases() {
    set -e
    cd "$RELEASES_DIR"
    ls -dt "$RELEASES_DIR"/* | tail -n +4 | xargs rm -rf
}
