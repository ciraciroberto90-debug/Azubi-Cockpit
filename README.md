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

## Status

- **Fertig (Muster):** 1. Lehrjahr — *Arbeitssicherheit* und *Grundkurs Metall* (Aufgabe, Theorie, Zeichnung fertig + zum Ergänzen, Praxis, Lösungsheft).
- **Gerüst:** alle weiteren Module über 3,5 Jahre (Struktur, Rahmenplan-Bezug, Lernfeld-Zuordnung stehen) — Inhalte folgen im gleichen Qualitätsstandard.
