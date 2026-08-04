# Deployment

Zero-Downtime-Deployment von `dspangenberg/opsc` auf `twiceware-opsc.de`
(quantum-forge, 77.42.67.43) über [Scotty](https://scotty.cmbsoftware.com).

## Schnellstart

```sh
scotty run deploy              # main
scotty run deploy --branch=develop
```

`Scotty.sh` liegt im Repo auf `main` und `develop`.

## Was beim Deploy passiert

1. Lokal: `git checkout $BRANCH` + `git pull origin $BRANCH`.
2. Remote: neues Release in `releases/YYYYMMDD-HHMMSS/` klonen
   (`git clone --depth 1 --branch $BRANCH git@github.com:dspangenberg/opsc`).
3. `.env` in das Release verlinken, `composer install --prefer-dist --no-dev -o`.
4. Assets bauen: `pnpm install --frozen-lockfile && pnpm build`, `node_modules` entfernen.
5. `storage` auf `persistent/storage` verlinken:
   `rm -rf storage && ln -nfs $PERSISTENT_DIR/storage storage`.
6. Migrationen: `php artisan migrate --force`.
7. Caches bauen (`config:cache`, `route:cache`, `view:cache`, `event:cache`,
   `cache:clear`), **dann** Freischalten: `current` -> neues Release.
   Danach `sudo systemctl reload php8.5-fpm`, `sudo systemctl restart
   reverb-twiceware.service` und `sudo systemctl restart queue-twiceware.service`
   (lange laufende Prozesse laden so den Code des neuen Releases).
8. Aufräumen: die ältesten Releases bis auf die letzten drei löschen.

Rücksetzbar: `current` zeigt immer nur auf ein Release; beim Fehlschlag einfach
`ln -nfs <altes Release> current` + Reload setzen. Dabei wird nur der **Code**
zurückgesetzt; bereits ausgeführte Migrationen sind forward-only und werden
nicht zurückgerollt. Schemaänderungen sollten deshalb backward-kompatibel sein,
der Symlink-Wechsel ist kein vollständiger Rollback des Datenbankzustands.

## Server-Voraussetzungen (einmalig eingerichtet)

- Deploy-Key `/home/twiceware/.ssh/id_ed25519_github` als GitHub-Deploy-Key für
  `dspangenberg/opsc`. Das ist der **server-seitige** Key, den Scotty beim
  GitHub-Clone nutzt (siehe `GIT_SSH_COMMAND` in `Scotty.sh`) - getrennt zu
  betrachten vom Container-Hop und vom lokalen SSH-Key des Entwicklers.
- `twiceware` darf per sudo: `systemctl reload php8.5-fpm`,
  `systemctl restart reverb-twiceware.service` und
  `systemctl restart queue-twiceware.service`.
- nginx-root zeigt auf `current/public`, FPM-Socket `php8.5-fpm-twiceware`.
- Verzeichnisstruktur: `current`, `releases/`, `persistent/storage`, `.env`
  (`.env` liegt außerhalb des Repos).

## Dev-Maschine: Voraussetzungen für `scotty`

`scotty` läuft über `lerd php`. Dabei ist zu beachten:

> `lerd php` (und damit `scotty`) führt Kommandos in einem Podman-Container
> (Alpine) als **root** aus. ssh sieht dadurch nur `/root/.ssh` und das
> Container-`/etc` — nicht dein echtes `~/.ssh`.

Typische Fehler, wenn die Container-Fixes fehlen:

- `Host key verification failed.` / `Permission denied (publickey)`
- `sh: bash: not found` (Scotty-Preamble ruft hart `bash -c ...` auf)

### Fix 1: SSH-Config im Container

Legt `/etc/ssh/ssh_config.d/scotty-deploy.conf` im Container an und zeigt ssh auf
Key und `known_hosts` im gemounteten Home:

```php
php -r 'file_put_contents("/etc/ssh/ssh_config.d/scotty-deploy.conf", "Host 77.42.67.43\n  User twiceware\n  IdentityFile /home/dspangenberg/.ssh/id_ed25519\n  UserKnownHostsFile /home/dspangenberg/.ssh/known_hosts\n  IdentitiesOnly yes\nHost github.com\n  User git\n  IdentityFile /home/dspangenberg/.ssh/id_ed25519\n  UserKnownHostsFile /home/dspangenberg/.ssh/known_hosts\n  IdentitiesOnly yes\n"); echo "written\n";'
```

### Fix 2: bash im Container installieren

```php
php -r 'echo shell_exec("apk add --no-cache bash 2>&1"); echo "bash-at: ".trim(shell_exec("command -v bash 2>/dev/null")).PHP_EOL;'
```

### Nach einem Container-Reset

Der Container verliert alle Änderungen unter `/etc` (dort liegt NICHT das echte
Dateisystem). Beide Fixes erneut ausführen. Gegenprobe:

```php
php -r '$cmd = "ssh -o ConnectTimeout=5 -o BatchMode=yes twiceware@77.42.67.43 \x27echo ok\x27"; $p = proc_open($cmd, [["pipe","r"],["pipe","w"],["pipe","w"]], $pi); $o = stream_get_contents($pi[1]); $e = stream_get_contents($pi[2]); foreach ($pi as $h) { fclose($h); } $c = proc_close($p); echo "exit=$c OUT=$o ERR=$e\n";'
```

Erwartung: `exit=0 OUT=ok`. Für GitHub zusätzlich:
`ssh -T git@github.com` -> `Hi dspangenberg! You've successfully authenticated...`.

Diese Checks validieren nur den **Container-Hop** (zum Server) und den lokalen
GitHub-Zugriff. Der **server-seitige** Deploy-Key für den eigentlichen Clone
liegt unter `/home/twiceware/.ssh/id_ed25519_github` auf dem Server und wird von
`GIT_SSH_COMMAND` in `Scotty.sh` verwendet. Gegenprobe auf dem Server:

```sh
ssh -i /home/twiceware/.ssh/id_ed25519_github -o IdentitiesOnly=yes -T git@github.com
# -> Hi twiceware! You've successfully authenticated, but GitHub does not provide shell access.
```
