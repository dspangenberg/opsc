# Setup: PDF-Dienste auf einem neuen Container / neuer Maschine

Damit WeasyPrint (PDF-Generierung), pdfcpu (Briefkopf-Wasserzeichen, Stempel, Merge) und
ocrmypdf (OCR / PDF/A) funktionieren, sind pro Maschine folgende Schritte nötig.
Die **Facit-Fonts sind kommerziell lizenziert und liegen bewusst NICHT im Git** –
sie müssen daher bei jedem neuen Setup einmalig installiert werden.

---

## 1. Alpine-Pakete im Lerd-Container

```bash
lerd php:pkg add weasyprint ocrmypdf pdfcpu tesseract-ocr-data-deu
```

- `weasyprint` – HTML → PDF
- `ocrmypdf` – OCR / PDF/A (zieht `tesseract-ocr`, `qpdf`, `pngquant`, `jbig2enc` automatisch mit)
- `pdfcpu` – Wasserzeichen/Stempel, Merge
- `tesseract-ocr-data-deu` – deutsche OCR-Sprachdaten

Optional je nach Bedarf:

```bash
lerd php:pkg add tesseract-ocr-data-eng tesseract-ocr-data-osd
```

- `-data-eng` – englische OCR-Sprachdaten
- `-data-osd` – **wichtig**: ohne dieses Paket schlägt `--rotate-pages` in ocrmypdf fehl

Binaritäten danach prüfen:

```bash
lerd php -r 'foreach (["/usr/bin/weasyprint", "/usr/bin/pdfcpu", "/usr/bin/ocrmypdf", "/usr/bin/tesseract", "/usr/bin/gs"] as $p) { echo $p.": ".var_export(is_executable($p), true)."\n"; }'
```

Mit `php:pkg list` sollte der deklarierte Satz sichtbar sein:

```bash
lerd php:pkg list
```

> Nach einem Container-/Image-Rebuild wird das Lerd-Image neu gebaut; die per
> `php:pkg add` deklarierten Pakete werden dabei automatisch erneut installiert,
> solange der Befehl im `../.lerd.yaml`-Kontext ausgeführt wurde. Die Fonts (siehe §2)
> liegen dagegen **nicht** im Image und müssen ggf. neu registriert werden.

Auf dem Ubuntu-Server entsprechend: `apt install ghostscript poppler-utils` sowie
WeasyPrint/pdfcpu/ocrmypdf gemäß Server-Doku (dort greift WeasyPrint über den systemweit
installierten Facit-Font).

---

## 2. Facit-Fonts

Quelldateien: `~/Downloads/facit-regular-webfont.ttf` und `facit-semibold-webfont.ttf`
Lokale (gitignored) Arbeitskopie: `../resources/fonts/facit`

Einmalig bzw. nach jedem frischen Checkout die beiden TTFs dorthin kopieren
(das Verzeichnis ist per `/resources/fonts` in `../.gitignore` von Git ausgeschlossen):

```bash
mkdir -p resources/fonts/facit
cp ~/Downloads/facit-regular-webfont.ttf ~/Downloads/facit-semibold-webfont.ttf resources/fonts/facit/
```

### a) WeasyPrint

WeasyPrint nutzt `@font-face { src: local("Facit"), url("file://resources/fonts/facit/…") }`.
Damit greift zuerst der **systemweit installierte** Font, der Projektpfad dient nur als Fallback.

**Server (Ubuntu):** Fonts systemweit installieren, dann greift `local("Facit")`:

```bash
sudo mkdir -p /usr/share/fonts/truetype/facit
sudo cp <Pfad>/facit-regular-webfont.ttf <Pfad>/facit-semibold-webfont.ttf /usr/share/fonts/truetype/facit/
sudo fc-cache -f
```

**Dev (Lerd):** optional, da der Fallback auf `../resources/fonts/facit` ohnehin funktioniert.
Falls gewünscht (nicht persistent, nach Container-Rebuild neu):

```bash
lerd php -r 'exec("mkdir -p /usr/share/fonts/facit && cp /home/dspangenberg/Projects/twiceware.cloud/opsc/resources/fonts/facit/*.ttf /usr/share/fonts/facit/ && fc-cache -f");'
```

### b) pdfcpu (Stempel / Wasserzeichen)

pdfcpu liest seine Font-Registry aus `$XDG_CONFIG_HOME/pdfcpu/fonts`. Die App setzt
`XDG_CONFIG_HOME` automatisch auf `storage_path('pdfcpu-config')` (siehe `../config/pdf.php`
→ `pdfcpu_config_dir`), damit die Registry das gemountete Projektverzeichnis nutzt und
Container-Rebuilds übersteht. Der Font muss aber **einmal pro Maschine** installiert werden. Auf der Dev-Maschine
läuft `pdfcpu` im Lerd-Container, deshalb über `lerd php` (das Projektverzeichnis ist
gemountet und `../resources/fonts/facit` bereits befüllt):

```bash
mkdir -p storage/pdfcpu-config
lerd php -r 'putenv("XDG_CONFIG_HOME=".getcwd()."/storage/pdfcpu-config"); exec("/usr/bin/pdfcpu fonts install ".getcwd()."/resources/fonts/facit/facit-semibold-webfont.ttf 2>&1",$o); echo implode("\n",$o);'
```

Auf dem Ubuntu-Server (pdfcpu direkt auf dem Host):

```bash
mkdir -p storage/pdfcpu-config
XDG_CONFIG_HOME="$PWD/storage/pdfcpu-config" pdfcpu fonts install <Pfad>/facit-semibold-webfont.ttf
```

Kontrolle – im Lerd-Container:

```bash
lerd php -r 'putenv("XDG_CONFIG_HOME=".getcwd()."/storage/pdfcpu-config"); exec("/usr/bin/pdfcpu fonts list 2>&1",$o); echo implode("\n",$o);'
```

Auf dem Server: `XDG_CONFIG_HOME="$PWD/storage/pdfcpu-config" pdfcpu fonts list`.

→ Unter `Userfonts(...)` muss `Facit-Semibold` auftauchen (üblicherweise `(233 glyphs)`).

> Hinweis: Der Wasserzeichen-Font in `../.env` muss mit dem internen Font-Namen
> übereinstimmen: `PDF_PDFCPU_WATERMARK_FONT="Facit-Semibold"`.

---

## 3. Ghostscript (PDF/A-Konvertierung)

Wird von `WeasyPdfService::convertToPdfA()` genutzt. Im Lerd-Container liegt `gs` als
Abhängigkeit von weasyprint/ocrmypdf unter `/usr/bin/gs`. Auf Ubuntu: `apt install ghostscript`.

---

## 4. Relevante `../.env`-Werte

| Variable | Wert | Hinweis |
|---|---|---|
| `PDF_WEASYPRINT_PATH` | `/usr/bin/weasyprint` | absoluter Pfad im Lerd-Container |
| `PDF_PDFCPU_PATH` | `/usr/bin/pdfcpu` | absoluter Pfad im Lerd-Container |
| `OCRMYPDF_PATH` | `/usr/bin/ocrmypdf` | absoluter Pfad im Lerd-Container |
| `PDF_PDFCPU_WATERMARK_FONT` | `Facit-Semibold` | muss dem internen pdfcpu-Font-Namen entsprechen |
| `PDF_PDFCPU_CONFIG_DIR` | *(optional)* | Standard: `../storage/pdfcpu-config` |

> Die `PDF_*`/`OCRMYPDF_PATH`-Werte in `../.env` müssen auf die Pfade **im Lerd-Container**
> zeigen (z. B. `/usr/bin/…`), nicht auf macOS-Pfade wie `/opt/homebrew/bin/…` —
> Letztere existieren im Container nicht und liefern „datei nicht gefunden“.

Danach `php artisan config:clear` ausführen.

---

## 5. Kurzcheck

```bash
php artisan test --filter=WeasyPdfServiceTest
```

Der Test verifiziert, dass alle pdfcpu-Aufrufe mit `XDG_CONFIG_HOME` (→ `pdfcpu-config`)
laufen.
