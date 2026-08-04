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

## Woher?

Frei lizenzierte ISO-7010-SVGs findest du z. B. auf **Wikimedia Commons**
(Dateinamen dort: `ISO 7010 M004.svg`, `ISO 7010 M003.svg`, …). Speichere sie unter
den obigen Kurznamen in diesen Ordner. Alternativ die Zeichen aus dem betrieblichen
DGUV-/Sicherheitszeichen-Satz verwenden.

## Danach

```
node build.js
```

`build.js` liest die Dateien ein, erzeugt daraus `js/signs-official.js` und bettet die
echten Piktogramme in `azubi-cockpit.html` ein. Fehlt eine Datei, bleibt für dieses
Zeichen die Nachbildung aktiv.
