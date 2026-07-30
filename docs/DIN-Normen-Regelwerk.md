# Norm-Regelwerk — Azubi Cockpit

> **Oberste Regel:** Reale Maßstäbe, reale Toleranzen, alles nach gültigen DIN-/ISO-Normen — Fachgebiet egal.
> **Kein erfundener Inhalt.** Jede Zahl, Norm und jeder Wert ist belegbar. Unsicheres wird als *„fachlich prüfen"* markiert, nicht erfunden.
> **Layout:** fester Zeichnungsrahmen + Innenrand, Objekt wird per Maßstab eingepasst — nichts läuft über den Rand.

Dieses Dokument ist die verbindliche Grundlage für **alle** Zeichnungen, Pläne und Arbeitsblätter der App.

---

## 1. Technisches Zeichnen

### 1.1 Maßstäbe — DIN ISO 5455
Das Objekt hat immer **reale mm-Maße**. Erst danach wird ein genormter Maßstab gewählt:

| Art | Maßstäbe |
|-----|----------|
| Originalgröße | **1:1** |
| Verkleinerung | 1:2 · 1:5 · 1:10 · 1:20 · 1:50 · 1:100 · 1:200 · 1:500 · 1:1000 |
| Vergrößerung | 2:1 · 5:1 · 10:1 · 20:1 · 50:1 |

Die Zeichen-Engine wählt automatisch den **größten passenden** Normmaßstab, sodass das Werkstück in den Zeichenbereich passt. Der gewählte Maßstab steht im Schriftfeld.

### 1.2 Linienarten — DIN ISO 128-2
| Linie | Verwendung | Breite (Gruppe 0,5) |
|-------|------------|---------------------|
| Breite Volllinie | Sichtbare Kanten, Umrisse | 0,5 mm |
| Schmale Volllinie | Maßlinien, Maßhilfslinien, Schraffuren | 0,25 mm |
| Schmale Strichlinie | Verdeckte Kanten | 0,25 mm |
| Schmale Strichpunktlinie | Mittel-/Symmetrielinien | 0,25 mm |
| Schmale Freihandlinie | Bruchkanten (Teilansicht) | 0,25 mm |

Breitenverhältnis breit : schmal = **2 : 1**.

### 1.3 Bemaßung — DIN ISO 129-1
- Maßlinien **schmal**, mit Maßpfeilen; Maßhilfslinien stehen ~2 mm über.
- Maßzahl **über** der Maßlinie, mittig; Grundeinheit **mm** (nicht angeschrieben).
- Durchmesser `⌀`, Radius `R`, Fase z. B. `2×45°`.
- Jedes Maß **nur einmal**; keine überflüssigen Maße; funktionsgerecht bemaßen.

### 1.4 Projektion — DIN ISO 5456-2
**Europäische Methode (Projektionsmethode 1 / erster Winkel)**: Draufsicht **unter** der Vorderansicht, Seitenansicht von links **rechts**. Kennzeichnung durch das genormte Projektionssymbol im/neben dem Schriftfeld.

### 1.5 Schriftfeld & Blatt
- **Schriftfeld:** DIN EN ISO 7200 — Datenfelder u. a. Benennung, Werkstoff, Maßstab, Zeichnungsnummer, Datum, Ersteller, Allgemeintoleranz.
- **Blattformate:** DIN EN ISO 5457 — A4 (210×297), A3 (297×420) …
- **Schrift:** DIN EN ISO 3098.

---

## 2. Toleranzen — DIN ISO 2768-1 (Allgemeintoleranzen)

### 2.1 Grenzabmaße für Längenmaße (in mm)
| Toleranzklasse | 0,5–3 | >3–6 | >6–30 | >30–120 | >120–400 | >400–1000 | >1000–2000 |
|---|---|---|---|---|---|---|---|
| **f** (fein) | ±0,05 | ±0,05 | ±0,1 | ±0,15 | ±0,2 | ±0,3 | ±0,5 |
| **m** (mittel) | ±0,1 | ±0,1 | ±0,2 | ±0,3 | ±0,5 | ±0,8 | ±1,2 |
| **c** (grob) | ±0,2 | ±0,3 | ±0,5 | ±0,8 | ±1,2 | ±2,0 | ±3,0 |
| **v** (sehr grob) | – | ±0,5 | ±1,0 | ±1,5 | ±2,5 | ±4,0 | ±6,0 |

### 2.2 Grenzabmaße für Fasen & Rundungshalbmesser (in mm)
| Klasse | 0,5–3 | >3–6 | >6 |
|---|---|---|---|
| f + m | ±0,2 | ±0,5 | ±1,0 |
| c + v | ±0,4 | ±1,0 | ±2,0 |

### 2.3 Grenzabmaße für Winkelmaße (nach Länge des kürzeren Schenkels)
| Klasse | ≤10 mm | >10–50 | >50–120 | >120–400 |
|---|---|---|---|---|
| **m** (mittel) | ±1° | ±0°30′ | ±0°20′ | ±0°10′ |

Zeichnungsangabe z. B.: **„Allgemeintoleranz ISO 2768-m"** im/neben dem Schriftfeld.

> Weiterführend (spätere Module): Passungen **DIN EN ISO 286** (ISO-Toleranzsystem, z. B. H7/g6), Form-/Lagetoleranzen **DIN EN ISO 1101**, Oberflächen **DIN EN ISO 21920** (Ra/Rz).

---

## 3. Pneumatik / Fluidtechnik — DIN ISO 1219

### 3.1 Grundregeln
- Schaltzeichen nach **ISO 1219-1**, immer in **Ruhestellung** gezeichnet.
- Kennzeichnung/Benennung nach **ISO 1219-2**.

### 3.2 Anschlussbezeichnungen Wegeventile (ISO 1219-2 / ISO 11727)
| Nummer | Bedeutung |
|---|---|
| **1** | Druckluftanschluss (P) |
| **2, 4** | Arbeitsanschlüsse (B, A) |
| **3, 5** | Entlüftungen (R, S) |
| **12, 14** | Steueranschlüsse — „12" verbindet 1→2, „14" verbindet 1→4 |

### 3.3 Bauteilkennzeichnung (Beispiel)
`0Z1` Wartungseinheit · `1V1` Wegeventil · `1V2/1V3` Drosselrückschlagventile · `1A` Zylinder.

---

## 4. Arbeitssicherheit — Normen & Regeln
- **Sicherheitszeichen / Kennzeichnung:** DIN EN ISO 7010 (Verbot, Gebot, Warnung, Rettung, Brandschutz).
- **Persönliche Schutzausrüstung (PSA):** DGUV Regeln/Vorschriften, PSA-Benutzungsverordnung.
- **Gefährdungsbeurteilung:** ArbSchG §5; Betriebssicherheitsverordnung.
- Farb-/Formcode Sicherheitszeichen: Verbot (rund, rot), Gebot (rund, blau), Warnung (Dreieck, gelb), Rettung/Brandschutz (Quadrat, grün/rot).

> Konkrete Vorschriften/Grenzwerte werden je Arbeitsblatt mit Quelle hinterlegt und als *„fachlich prüfen"* markiert, bis von der Ausbildung bestätigt.

---

## Quellen (recherchiert)
- Maßstäbe/Bemaßung/Linien: DIN ISO 5455, DIN ISO 129-1, DIN ISO 128-2 · Wikipedia „Technische Zeichnung", ISO 128.
- Toleranzen: DIN ISO 2768-1 — Wikipedia „Toleranztabellen nach ISO 2768"; TU München Werkstatt-Merkblatt.
- Pneumatik: DIN ISO 1219-1/-2 — HAFNER Pneumatik Schulung Kap. 5; STAUFF Schaltzeichen.
- Ausbildungsrahmenplan Mechatroniker (VO 2011/2018), IHK „Sachliche und zeitliche Gliederung"; gesetze-im-internet.de MechatronikerAusbV.
