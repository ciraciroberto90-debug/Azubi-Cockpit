# Azubi Cockpit — Mechatroniker/in

Das digitale Hauptquartier für die Ausbildung zum/zur **Mechatroniker/in**.
Strukturiert nach **Ausbildungsrahmenplan (Betrieb)** *und* **Lernfeldern (Berufsschule)** —
mit druckfertigen Arbeitsblättern, **echten technischen Zeichnungen & Plänen** (normgerecht,
maßstäblich) und Lösungsheften.

## Leitprinzipien

1. **Erklären → Lernen → Tun.** Jede Aufgabe: *Aufgabe wird erklärt · Theorie wird gemacht · Praxis wird ausgeführt.*
2. **Duale Struktur überall.** Betrieb (Rahmenplan, Wochen) + Berufsschule (13 KMK-Lernfelder) durchgängig in der ganzen App.
3. **Reale Normen.** Maßstäbe (ISO 5455), Linienarten (ISO 128), Bemaßung (ISO 129),
   Toleranzen (ISO 2768), Schriftfeld (ISO 7200), Pneumatik (ISO 1219). Siehe [`docs/DIN-Normen-Regelwerk.md`](docs/DIN-Normen-Regelwerk.md).
4. **Kein erfundener Inhalt.** Jeder Wert ist belegbar; Unsicheres wird als *„fachlich prüfen"* markiert.
5. **Layout im Rahmen.** Zeichnungen werden automatisch genormt skaliert und in den Blattrahmen eingepasst — kein Überstand.

## Aufbau

```
index.html                      Cockpit (Startseite, Router)
css/cockpit.css                 UI-Design (Werkstatt/Blaupause, hell+dunkel)
css/print.css                   Blatt-Druck (DIN A4 → PDF)
js/data/curriculum.js           Gerüst: 3,5 Jahre, Module (Rahmenplan) + 13 Lernfelder
js/lib/zeichnung.js             Normgerechte Zeichen-Engine (Auto-Maßstab, Schriftfeld, Bemaßung)
js/module/m1-arbeitssicherheit.js   Muster-Modul 1 (fertig)
js/module/m5-grundkurs-metall.js    Muster-Modul 2 (fertig) inkl. echter Zeichnung
js/app.js                       Views: Start · Lehrjahr · Modul · Blatt
docs/DIN-Normen-Regelwerk.md    Recherchierte Normbasis (verbindlich)
```

## Starten

Einfach `index.html` im Browser öffnen (keine Installation nötig).
Empfohlen für den Druck: ein einzelnes Blatt öffnen → **„Dieses Blatt drucken (PDF)"**.

> Hinweis: Manche Browser blockieren lokale `file://`-Skripte. Falls die Seite leer bleibt,
> im Projektordner einen kleinen Server starten, z. B. `python3 -m http.server`, und
> `http://localhost:8000` öffnen.

## Parametrischer Teile-Generator (`js/lib/teile.js`)

Werkstücke werden als **Daten** beschrieben, die Engine erzeugt daraus automatisch
die normgerechte Zeichnung (Vorderansicht + Schnitt A–A + Bemaßung + Schriftfeld)
**und** die Prüfmaße. So entstehen viele Aufgaben schnell und im selben Standard.

```js
AZ.parts.platte({ benennung:"Halteplatte", nummer:"GM-101", w:90, h:50, t:15,
  fase:2, ra:"3,2",
  features:[ {typ:"bohrung", x:25, y:25, d:12, passung:"H9"},
             {typ:"gewinde", x:65, y:25, gew:"M8"} ] });
// -> .svg("fertig") | .svg("ergaenzen")  +  .masse()  (Prüftabelle, auto)
```

Teile-Typen (10): `platte` (Bohrung/Gewinde/Senkung/**Langloch**/**Nut** +
Fase/Ra/Schnitt), `welle` (Absätze, auch **kegelig** über End-⌀), `scheibe`
(Flansch mit Lochkreis), `winkel` (L-Profil), `buchse` (Hülse, Längsschnitt),
`uprofil`, `tprofil`, `zahnrad` (Stirnrad-Grundform), `biegeteil`, `bolzen` —
jeweils mit Ansicht/Schnitt, Bemaßung, Schriftfeld und Prüfmaßen.

## Skizzen-Modus (Freihand, Mini-CAD)

Menüpunkt **✎ Skizze** (`#/tools/skizze`): SVG-Zeichenbrett mit 5-mm-Raster
und Fang. Werkzeuge: Linie · Mittellinie · Kreis · **Bogen** · Rechteck · Maß ·
**Radius** · Text · **Verschieben** · Löschen. Dazu **Schriftfeld** ein/aus,
**Speichern/Laden** (JSON, plus Auto-Speichern), Rückgängig, Leeren und
Drucken (PDF). Maße in mm.

## Aufgaben-Katalog & Lernpfad

`Grundkurs Metall` ist als **Katalog** aufgebaut (`js/module/m5-grundkurs-metall.js`):
7 Teilgebiete (Prüfen, Feilen, Sägen, Bohren & Senken, Gewinde, Biegen, Übungsstück)
mit Theorie + generierten Aufgaben. Das Cockpit zeigt einen **empfohlenen Lernpfad**
und einen **filterbaren Katalog** (Thema · Schwierigkeit).

## Aufgabe erstellen (Werkzeug)

Über den Menüpunkt **＋ Erstellen** (`#/tools/erstellen`) kannst du selbst ein Werkstück
beschreiben — **Typ wählbar**: Platte · Welle · Scheibe/Flansch · Biegeteil · Bolzen —
und bekommst live eine normgerechte Zeichnung mit Ansicht/Schnitt, Bemaßung und
Prüfmaßen, als Fertigzeichnung oder „zum Ergänzen“ druckbar.

## Status

- **1. Lehrjahr komplett** (7 Module, 61 Blätter):
  - m1 *Arbeitssicherheit* (ISO 7010, TOP-Prinzip)
  - m2 *Technisches Zeichnen* (Katalog: Linien/Ansichten, Bemaßung, Schnitte, Toleranzen/Passungen, Oberfläche/Schriftfeld — Lese- & Ergänzen-Übungen)
  - m3 *Planen & Organisieren* (Arbeitsplan, Werkzeugliste)
  - m4 *Prüfen, Anreißen & Kennzeichnen* (Messschieber-Ablesung, Toleranzberechnung)
  - m5 *Grundkurs Metall* (Katalog über 11 Wochen, 24 generierte Zeichnungen + Projekt-Reihe)
  - m6 *Fügen* (Verbindungsarten, Montage Haltewinkel)
  - m7 *Zwischenprüfung Teil 1* (Prüfungsstück + schriftliche Wiederholung)
- **Gerüst:** 2. und 3. Lehrjahr (Struktur, Rahmenplan-Bezug, Lernfeld-Zuordnung stehen) — werden mit dem Generator im gleichen Standard gefüllt.
