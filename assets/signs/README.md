# Offizielle Sicherheitszeichen (DIN EN ISO 7010)

Lege hier die **offiziellen SVG-Dateien** der Sicherheitszeichen ab — die App nutzt
sie dann automatisch (statt der eingebauten Nachbildungen), überall und auch in der
Standalone-Datei.

## Benötigte Dateien (genaue Namen)

| Datei          | Bedeutung                          |
|----------------|------------------------------------|
| `M004.svg`     | Augenschutz benutzen               |
| `M003.svg`     | Gehörschutz benutzen               |
| `M008.svg`     | Fußschutz benutzen                 |
| `P028.svg`     | Benutzen von Handschuhen verboten  |
| `W001.svg`     | Allgemeines Warnzeichen            |
| `E003.svg`     | Erste Hilfe                        |
| `F001.svg`     | Feuerlöscher                       |

## Quelle der aktuell hinterlegten Dateien

Die 7 SVGs in diesem Ordner stammen aus dem npm-Paket **`@iso-safety-signs/core`**
(Lizenz **MIT**) — offizielle ISO-7010-Piktogramme. Ersetzen kannst du sie jederzeit
durch andere lizenzierte Dateien (z. B. Wikimedia Commons `ISO 7010 M004.svg`, … oder
den betrieblichen DGUV-Zeichensatz) unter den obigen Kurznamen.

## Danach

```
node build.js
```

`build.js` liest die Dateien ein, erzeugt daraus `js/signs-official.js` und bettet die
echten Piktogramme in `azubi-cockpit.html` ein. Fehlt eine Datei, bleibt für dieses
Zeichen die Nachbildung aktiv.
