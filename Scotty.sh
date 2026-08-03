#!/usr/bin/env scotty

# Scotty.sh fuer twiceware-opsc.de (quantum-forge, dspangenberg/opsc).
# Deploy:  scotty run deploy
# Anderer Branch:  scotty run deploy --branch=develop
#
# Voraussetzungen (auf dem Server eingerichtet):
#   - Deploy-Key /home/twiceware/.ssh/id_ed25519_github ist als Deploy-Key
#     im GitHub-Repo dspangenberg/opsc hinterlegt.
#   - twiceware darf per sudo das FPM-Pool-Update + Reverb neu starten.
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

# @task on:local
startDeployment() {
    git checkout $BRANCH
    git pull origin $BRANCH
}

# @task on:remote
cloneRepository() {
    [ -d $RELEASES_DIR ] || mkdir -p $RELEASES_DIR
    [ -d $PERSISTENT_DIR ] || mkdir -p $PERSISTENT_DIR
    [ -d $PERSISTENT_DIR/storage ] || mkdir -p $PERSISTENT_DIR/storage

    cd $RELEASES_DIR
    git clone --depth 1 --branch $BRANCH git@github.com:$REPOSITORY $NEW_RELEASE_NAME
}

# @task on:remote
runComposer() {
    cd $NEW_RELEASE_DIR
    ln -nfs $BASE_DIR/.env .env
    composer install --prefer-dist --no-dev -o
}

# @task on:remote
buildAssets() {
    cd $NEW_RELEASE_DIR
    pnpm install --frozen-lockfile
    pnpm build
    rm -rf node_modules
}

# @task on:remote
updateSymlinks() {
    rm -rf $NEW_RELEASE_DIR/storage
    cd $NEW_RELEASE_DIR
    ln -nfs $PERSISTENT_DIR/storage storage
}

# @task on:remote
migrateDatabase() {
    cd $NEW_RELEASE_DIR
    php artisan migrate --force
}

# @task on:remote
blessNewRelease() {
    ln -nfs $NEW_RELEASE_DIR $CURRENT_DIR

    cd $NEW_RELEASE_DIR
    php artisan config:cache
    php artisan route:cache
    php artisan view:cache
    php artisan event:cache
    php artisan cache:clear

    sudo systemctl reload php8.5-fpm
    sudo systemctl restart reverb-twiceware.service
}

# @task on:remote
cleanOldReleases() {
    cd $RELEASES_DIR
    ls -dt $RELEASES_DIR/* | tail -n +4 | xargs rm -rf
}
