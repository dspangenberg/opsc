# Deployment

Zero-Downtime-Deployment von `dspangenberg/opsc` auf `twiceware-opsc.de`
(quantum-forge, `twiceware-opsc.de` → `91.98.66.4`) über
[Scotty](https://scotty.cmbsoftware.com).

## Schnellstart

```sh
scotty run deploy              # main
scotty run deploy --branch=develop
```

`Scotty.sh` liegt im Repo auf `main` und `develop`.

## Was beim Deploy passiert

1. Lokal: nichts — das lokale Repo wird nicht angefasst; der Deploy-Zweig wird direkt vom Server aus GitHub geklont.
2. Remote: neues Release in `releases/YYYYMMDD-HHMMSS/` klonen
   (`git clone --depth 1 --branch $BRANCH git@github.com:dspangenberg/opsc`).
3. `.env` in das Release verlinken, `composer install --prefer-dist --no-dev -o`.
4. Assets bauen: `pnpm install --frozen-lockfile && pnpm build`, `node_modules` entfernen.
5. `storage` auf `persistent/storage` verlinken:
   `rm -rf storage && ln -nfs $PERSISTENT_DIR/storage storage`.
6. Migrationen: `php artisan migrate --force`.
7. Freischalten: `current` -> neues Release, Caches bauen
   (`config:cache`, `route:cache`, `view:cache`, `event:cache`, `cache:clear`),
   `sudo systemctl reload php8.5-fpm`,
   `sudo systemctl restart twiceware-opsc-reverb.service`,
   `sudo systemctl restart twiceware-opsc-queue-default.service`,
   `sudo systemctl restart twiceware-opsc-schedule.service`.
8. Aufräumen: die ältesten Releases bis auf die letzten drei löschen.

Rücksetzbar: `current` zeigt immer nur auf ein Release; beim Fehlschlag einfach
`ln -nfs <altes Release> current` setzen und danach die Dienste wie beim
regulären Deploy neu starten:

```sh
sudo systemctl reload php8.5-fpm
sudo systemctl restart twiceware-opsc-reverb.service
sudo systemctl restart twiceware-opsc-queue-default.service
sudo systemctl restart twiceware-opsc-schedule.service
```

## Server-Voraussetzungen (einmalig eingerichtet)

- Deploy-Key `/home/twiceware/.ssh/id_ed25519_github` als GitHub-Deploy-Key für
  `dspangenberg/opsc`.
- `twiceware` darf per sudo: `systemctl reload php8.5-fpm`,
  `systemctl restart twiceware-opsc-reverb.service`,
  `systemctl restart twiceware-opsc-queue-default.service` und
  `systemctl restart twiceware-opsc-schedule.service`.
- nginx-root zeigt auf `current/public`, FPM-Socket `php8.5-fpm-twiceware`.
- Verzeichnisstruktur: `current`, `releases/`, `persistent/storage`, `.env`
  (`.env` liegt außerhalb des Repos).

## Dev-Maschine: Voraussetzungen für `scotty`

`scotty` läuft über `lerd php`. Dabei ist zu beachten:

> `lerd php` (und damit `scotty`) führt Kommandos in einem Podman-Container
> (Alpine) als **root** aus. ssh läuft damit außerhalb deiner normalen
> Shell-Umgebung: HOME und Konfiguration kommen aus dem Container-`/etc`, und
> `known_hosts`/ssh-config müssen auf das gemountete Home (`/home/dspangenberg/.ssh`)
> zeigen, statt auf das unsichtbare `/root/.ssh`.

Typische Fehler, wenn die Container-Fixes fehlen:

- `Host key verification failed.` (leere `known_hosts` im gemounteten Home)
- `Permission denied (publickey)` (ssh-Config zeigt auf falschen Key/Port)
- `sh: bash: not found` (Scotty-Preamble ruft hart `bash -c ...` auf)

### Fix 1: SSH-Config im Container

Legt `/etc/ssh/ssh_config.d/scotty-deploy.conf` im Container an und zeigt ssh auf
Key und `known_hosts` im gemounteten Home. Die Zieladresse des Deploy-Servers ist
der Hostname `twiceware-opsc.de` (derzeit `91.98.66.4`) — nicht die veraltete IP
`77.42.67.43` aus früheren Setups:

```php
php -r 'file_put_contents("/etc/ssh/ssh_config.d/scotty-deploy.conf", "Host twiceware-opsc.de\n  HostName twiceware-opsc.de\n  User twiceware\n  IdentityFile /home/dspangenberg/.ssh/id_ed25519\n  UserKnownHostsFile /home/dspangenberg/.ssh/known_hosts\n  IdentitiesOnly yes\nHost github.com\n  User git\n  IdentityFile /home/dspangenberg/.ssh/id_ed25519\n  UserKnownHostsFile /home/dspangenberg/.ssh/known_hosts\n  IdentitiesOnly yes\n"); echo "written\n";'
```

### Fix 2: bash im Container installieren

```php
php -r 'echo shell_exec("apk add --no-cache bash 2>&1"); echo "bash-at: ".trim(shell_exec("command -v bash 2>/dev/null")).PHP_EOL;'
```

### Fix 3: GitHub-Host-Key in `known_hosts`

Die gemountete `known_hosts` ist bei frischem Setup leer, daher bricht ssh mit
`Host key verification failed` ab. Den GitHub-Host-Key (ed25519) einmalig schreiben:

```php
php -r '$k="/home/dspangenberg/.ssh/known_hosts"; if (!str_contains((string)@file_get_contents($k), "github.com")) { file_put_contents($k, "github.com ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOMqqnkVzrm0SdG6UOoqKLsabgH5C9okWi0dh2l9GKJl\n", FILE_APPEND); } echo "ok\n";'
```

### Nach einem Container-Reset

Der Container verliert alle Änderungen unter `/etc` (dort liegt NICHT das echte
Dateisystem). `bash` ist dauerhaft über `lerd php:pkg add bash` deklariert und
übersteht Image-Rebuilds, jedoch gehen die unter `/etc` angelegte ssh-Config und
das unter `/usr/local/bin` installierte `scotty`-Binary verloren. Nach einem
Reset daher Fix 1 (ssh-Config) und Fix 4 (scotty) erneut ausführen. Gegenprobe:

```php
php -r '$cmd = "ssh -o ConnectTimeout=5 -o BatchMode=yes twiceware@twiceware-opsc.de \x27echo ok\x27"; $p = proc_open($cmd, [["pipe","r"],["pipe","w"],["pipe","w"]], $pi); $o = stream_get_contents($pi[1]); $e = stream_get_contents($pi[2]); foreach ($pi as $h) { fclose($h); } $c = proc_close($p); echo "exit=$c OUT=$o ERR=$e\n";'
```

Erwartung: `exit=0 OUT=ok`. Für GitHub zusätzlich:
`ssh -T git@github.com` -> `Hi dspangenberg! You've successfully authenticated...`.

### Fix 4: Scotty (PHAR) im Container installieren

`scotty` ist ein separates CLI (Spatie, `Scotty.sh`-Parser) und wird über `lerd php`
ausgeführt. Es liegt als PHAR unter `/usr/local/bin/` und geht bei Image-Rebuilds
verloren:

```php
php -r '$url="https://github.com/spatie/scotty/releases/latest/download/scotty"; $dest="/usr/local/bin/scotty"; echo shell_exec("curl -sL $url -o $dest && chmod +x $dest"); echo shell_exec("scotty --version 2>&1 | head -1");'
```

Kontrolle: `scotty doctor` -> `Everything looks good. You're ready to deploy.`

> Hinweis zum Server-Key: Falls ssh zum Server `Permission denied (publickey,password)`
> liefert, obwohl die Verbindung zustande kommt, ist der Client-Key
> (`~/.ssh/id_ed25519`) nicht (mehr) auf dem Server als `twiceware` autorisiert.
> Das ist unabhängig von den Container-Fixes und muss am Server über
> `authorized_keys` gepflegt werden.

### Offen: Client-Key auf dem Deploy-Server autorisieren

Aktuell (Stand 2026-08-28) akzeptiert der Deploy-Server den Client-Key noch nicht
(`Permission denied (publickey,password)`). Einmaliger Server-Zugang nötig.

Wichtig: Die Hetzner-Console meldet sich häufig als **root** an. Root ist NUT
ausreichend — der Schlüssel muss im Home des Deploy-Users **`twiceware`** unter
`/home/twiceware/.ssh/authorized_keys` stehen, nicht unter `/root/.ssh`. Sonst
lehnt der Server den Key beim Login als `twiceware` ab.

Als root (oder mit sudo) eintragen:

```sh
# Verzeichnis + Schlüssel im Home von twiceware anlegen (expliziter Pfad!)
mkdir -p /home/twiceware/.ssh && chmod 700 /home/twiceware/.ssh

cat >> /home/twiceware/.ssh/authorized_keys <<'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ99UEt5Mw53GA/SppauO2cV4YRtmrrTwtEtx2nes9Pr dspangenberg@tumbleweed
EOF

# Besitzer und Rechte korrekt setzen (sonst weigert sshd sich!)
chown -R twiceware:twiceware /home/twiceware/.ssh
chmod 600 /home/twiceware/.ssh/authorized_keys
```

Kontrolle (soll den einen Schlüssel zeigen, NICHT `/root/.ssh`):
`grep dspangenberg /home/twiceware/.ssh/authorized_keys`

Alternativ auf dem Server als `twiceware` selbst (falls schon ein Login besteht):

```sh
mkdir -p ~/.ssh && chmod 700 ~/.ssh
echo "ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIJ99UEt5Mw53GA/SppauO2cV4YRtmrrTwtEtx2nes9Pr dspangenberg@tumbleweed" >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```

Der zum Client-Key gehörende öffentliche Schlüssel ist **dieselbe
`id_ed25519.pub`**, die bereits in den GitHub-Einstellungen hinterlegt ist
(Fingerabdruck `SHA256:xwyXD65ZCgoFsWxSBJ2Kv+0vm9vsvxGGiv4JVnN/Umc`, Kommentar
`dspangenberg@tumbleweed`). Nach dem Eintragen greift `scotty run deploy` wieder.

### Server-seitige Deploy-Voraussetzungen (geprüft 2026-08-28)

Der Server braucht zusätzlich einen eigenen Zugang zu GitHub, weil die Task
„Clone repository" auf dem Server ein `git clone git@github.com:dspangenberg/opsc`
ausführt. Verifiziert mit:

```sh
# Client -> Server login + Server -> GitHub Deploy-Key:
git ls-remote git@github.com:dspangenberg/opsc HEAD
# -> liefert einen commit-hash (z. B. 4a0d634d...)
```

Server-seitige Schlüssel (User `twiceware`):
- `~/.ssh/id_ed25519_github` — **GitHub-Deploy-Key** des Repos `dspangenberg/opsc`
  (bestätigt durch `Hi dspangenberg/opsc! You've successfully authenticated`).
- `~/.ssh/config`: `github.com` → `IdentityFile ~/.ssh/id_ed25519_github` +
  `IdentitiesOnly yes`.
- `~/.ssh/authorized_keys` — enthält unseren Client-Key (für den Login).

Weitere Remote-Tools (von `scotty doctor` / manuell geprüft):
- `php 8.5.9`, `composer 2.10.2`, `node 26.7.0`, `npm 11.19.0`, `git 2.53.0`,
  `pnpm 11.21.0` (für `buildAssets`).

Nicht-invasiver Check, dass scotty startbereit ist:
`scotty doctor` -> `Everything looks good. You're ready to deploy.`

---

## PDF-Dienste: WeasyPrint, pdfcpu, ocrmypdf & Facit-Fonts

Die ausführliche Anleitung steht in [`setup.md`](setup.md). Kurzfassung für den
Lerd-Container (die vollständigen Befehle stehen in `setup.md`):

**1. Alpine-Pakete deklarieren** (übersteht Image-Rebuilds, da via `.lerd.yaml`-Kontext):

```bash
lerd php:pkg add weasyprint ocrmypdf pdfcpu tesseract-ocr-data-deu
# optional: tesseract-ocr-data-eng tesseract-ocr-data-osd
```

**2. Facit-Fonts** (kommerziell, liegen NICHT im Git — `resources/fonts/facit/` ist gitignored).
Quelle: `~/Downloads/facit-regular-webfont.ttf` und `facit-semibold-webfont.ttf`.

- **WeasyPrint:** lädt über `@font-face` zuerst den systemweit installierten Font
  (Server: `/usr/share/fonts/truetype/facit/`), Projektpfad dient als Fallback.
- **pdfcpu:** Registry über `$XDG_CONFIG_HOME` → `storage/pdfcpu-config` (App setzt das
  automatisch). Font einmalig installieren:

```bash
mkdir -p storage/pdfcpu-config
lerd php -r 'putenv("XDG_CONFIG_HOME=".getcwd()."/storage/pdfcpu-config"); exec("/usr/bin/pdfcpu fonts install ".getcwd()."/resources/fonts/facit/facit-semibold-webfont.ttf 2>&1",$o); echo implode("\n",$o);'
```

Kontrolle: `pdfcpu fonts list` -> `Facit-Semibold` unter `Userfonts`.
`.env`: `PDF_PDFCPU_WATERMARK_FONT="Facit-Semibold"` (muss dem internen Font-Namen entsprechen).

**3. Relevante `.env`-Pfade** (auf den Lerd-Container zeigen, nicht macOS-Pfade):

| Variable | Wert |
|---|---|
| `PDF_WEASYPRINT_PATH` | `/usr/bin/weasyprint` |
| `PDF_PDFCPU_PATH` | `/usr/bin/pdfcpu` |
| `OCRMYPDF_PATH` | `/usr/bin/ocrmypdf` |
| `PDF_PDFCPU_WATERMARK_FONT` | `Facit-Semibold` |

Danach `php artisan config:clear` ausführen.

**4. Kurzcheck:** `php artisan test --filter=WeasyPdfServiceTest`
