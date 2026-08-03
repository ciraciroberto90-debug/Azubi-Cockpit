/* ============================================================================
   Modul-Inhalt: Betriebliche & technische Kommunikation · Technisches Zeichnen
   Rahmenplan: "Betriebliche und technische Kommunikation" (7 Wo.)
   Berufsschule: Lernfeld 1 "Analysieren von Funktionszusammenhängen".
   Normen: DIN ISO 128-2, 129-1, 5455, 5456, EN ISO 7200, 2768, EN ISO 286.
   Übungen: Zeichnungen lesen und ergänzen (Generator), Toleranzen berechnen.
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};
var TZ = AZ.parts;

var TZ_TG = [
  {
    id: "linien", titel: "Linien & Ansichten", kurz: "Linienarten, Dreitafelprojektion", theorieWoche: 1,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 1</span><span>DIN ISO 128 / 5456</span></div>' +
        '<h3>Linienarten (DIN ISO 128-2)</h3>' +
        '<table class="tab"><thead><tr><th>Linie</th><th>Verwendung</th></tr></thead><tbody>' +
        '<tr><td>Breite Volllinie</td><td>sichtbare Kanten, Umrisse</td></tr>' +
        '<tr><td>Schmale Volllinie</td><td>Maßlinien, Maßhilfslinien, Schraffur</td></tr>' +
        '<tr><td>Schmale Strichlinie</td><td>verdeckte Kanten</td></tr>' +
        '<tr><td>Schmale Strichpunktlinie</td><td>Mittel-/Symmetrielinien</td></tr></tbody></table>' +
        '<h3>Ansichten — Dreitafelprojektion (europäische Methode, 1. Winkel)</h3>' +
        '<p>Vorderansicht (Hauptansicht), Draufsicht <strong>darunter</strong>, Seitenansicht von links <strong>rechts</strong> daneben. Die Ansichten sind aufeinander projiziert (fluchten).</p>' +
        '<p class="frage">Frage 1: Welche Linienart stellt eine verdeckte Kante dar? ____________________</p>' +
        '<p class="frage">Frage 2: Wo steht die Draufsicht in der europäischen Methode? ____________________</p>';
    },
    aufgaben: [
      {
        blattNr: "TZ-101", schwierigkeit: "leicht", woche: 1, typ: "theorie", render: function () {
          return leseAufgabe({
            meta: ["Zeichnung lesen", "Woche 1", "TZ-101"],
            text: "Betrachte die Zeichnung und beantworte die Fragen zu Ansichten und Linien.",
            api: TZ.platte({ benennung: "Übungsteil", nummer: "TZ-101", w: 80, h: 50, t: 15, features: [{ typ: "bohrung", x: 40, y: 25, d: 12 }] }),
            fragen: ["Wie viele Ansichten zeigt die Zeichnung (inkl. Schnitt)?",
              "Mit welcher Linienart ist die Mittellinie der Bohrung gezeichnet?",
              "Welche Linienart begrenzt die sichtbaren Außenkanten?"],
            loesungen: ["Vorderansicht + Schnitt A–A (2 Darstellungen).",
              "Schmale Strichpunktlinie (Mittellinie).",
              "Breite Volllinie (sichtbare Kanten)."],
          });
        },
      },
      {
        blattNr: "TZ-102", schwierigkeit: "mittel", woche: 2, typ: "zeichnung", render: function () {
          var api = TZ.platte({ benennung: "Ansicht ergänzen", nummer: "TZ-102", w: 70, h: 45, t: 12, features: [{ typ: "bohrung", x: 35, y: 22.5, d: 10 }] });
          return '<div class="bl-meta"><span>Zeichnung ergänzen</span><span>Woche 2</span><span>TZ-102</span></div>' +
            '<div class="anknuepf">Schalte auf „Zum Ergänzen“ um und trage fehlende Ansicht/Schnitt und Maße ein.</div>' +
            '<h3>Aufgabe</h3><p>Ergänze den fehlenden Schnitt A–A sowie die Maße. Kontrolliere über die Fertigzeichnung.</p>' +
            azZeichnungBlock(api);
        },
      },
    ],
  },
  {
    id: "bemassung", titel: "Bemaßung & Maßstäbe", kurz: "DIN ISO 129 / 5455", theorieWoche: 3,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 3</span><span>DIN ISO 129 / 5455</span></div>' +
        '<h3>Bemaßung (DIN ISO 129-1)</h3><p>Maßlinien schmal mit Maßpfeilen, Maßhilfslinien stehen ~2 mm über, Maßzahl über der Maßlinie. Durchmesser ⌀, Radius R. Grundeinheit mm (nicht angeschrieben). Jedes Maß nur einmal.</p>' +
        '<h3>Maßstäbe (DIN ISO 5455)</h3><p>Originalgröße 1:1; Verkleinerung 1:2, 1:5, 1:10 …; Vergrößerung 2:1, 5:1, 10:1. Das Werkstück behält reale mm-Maße — nur die Darstellung wird skaliert.</p>' +
        '<p class="frage">Frage: Welches Zeichen steht vor einem Durchmessermaß? ____________________</p>';
    },
    aufgaben: [
      {
        blattNr: "TZ-111", schwierigkeit: "leicht", woche: 3, typ: "theorie", render: function () {
          return leseAufgabe({
            meta: ["Zeichnung lesen", "Woche 3", "TZ-111"],
            text: "Lies die Maße aus der Zeichnung ab.",
            api: TZ.platte({ benennung: "Maßübung", nummer: "TZ-111", w: 90, h: 50, t: 15, features: [{ typ: "bohrung", x: 30, y: 25, d: 12, passung: "H9" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }),
            fragen: ["Wie groß ist die Länge des Werkstücks?", "Wie groß ist die Dicke?",
              "Welchen Durchmesser hat die linke Bohrung und welche Passung?", "Welches Gewinde hat die rechte Bohrung?"],
            loesungen: ["Länge = 90 mm.", "Dicke = 15 mm.", "⌀12 H9.", "M8."],
          });
        },
      },
      {
        blattNr: "TZ-112", schwierigkeit: "mittel", woche: 3, typ: "zeichnung", render: function () {
          var api = TZ.platte({ benennung: "Bemaßen", nummer: "TZ-112", w: 100, h: 60, t: 10, features: [{ typ: "bohrung", x: 30, y: 30, d: 8 }, { typ: "bohrung", x: 70, y: 30, d: 8 }] });
          return '<div class="bl-meta"><span>Zeichnung ergänzen</span><span>Woche 3</span><span>TZ-112</span></div>' +
            '<h3>Aufgabe</h3><p>Bemaße das Werkstück vollständig (Länge, Breite, Dicke, Lochabstände, Durchmesser). Kontrolle über die Fertigzeichnung.</p>' +
            azZeichnungBlock(api);
        },
      },
    ],
  },
  {
    id: "schnitte", titel: "Schnitte", kurz: "Schnittdarstellung, Schraffur", theorieWoche: 4,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 4</span><span>DIN ISO 128</span></div>' +
        '<h3>Schnittdarstellung</h3><p>Ein Schnitt zeigt das Innere eines Werkstücks. Der Schnittverlauf wird mit einer Strichpunktlinie und Pfeilen (Blickrichtung) sowie Buchstaben (A–A) gekennzeichnet. Geschnittene Flächen erhalten eine <strong>Schraffur</strong> (schmale Volllinien, meist 45°).</p>' +
        '<p class="frage">Frage: Womit werden geschnittene (volle) Flächen gekennzeichnet? ____________________</p>';
    },
    aufgaben: [
      {
        blattNr: "TZ-121", schwierigkeit: "mittel", woche: 4, typ: "theorie", render: function () {
          return leseAufgabe({
            meta: ["Zeichnung lesen", "Woche 4", "TZ-121"],
            hinweis: "Dasselbe Prüfungsstück wie im Grundkurs Metall (Halteplatte).",
            text: "Werte den Schnitt A–A aus.",
            api: TZ.platte({ benennung: "Halteplatte", nummer: "GM-190", w: 90, h: 50, t: 15, fase: 2, ra: "3,2", features: [{ typ: "bohrung", x: 25, y: 25, d: 12, passung: "H9" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }),
            fragen: ["Was zeigt der Schnitt A–A?", "Welche der beiden Bohrungen ist ein Gewinde und woran erkennst du es im Schnitt?", "Wie ist die Kante oben im Schnitt bearbeitet?"],
            loesungen: ["Das Innere der Platte in Dickenrichtung (15 mm) mit Durchgangsbohrung und Gewinde.",
              "Die rechte (M8): im Schnitt Kern-⌀ als breite und Nenn-⌀ als schmale Linie (DIN ISO 6410).",
              "Fase 2×45° (gebrochene Kante)."],
          });
        },
      },
    ],
  },
  {
    id: "toleranzen", titel: "Toleranzen & Passungen", kurz: "ISO 2768, ISO 286, H7/g6", theorieWoche: 6,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 6</span><span>DIN ISO 2768 / EN ISO 286</span></div>' +
        '<h3>Allgemeintoleranzen (DIN ISO 2768-1)</h3><p>Grenzabmaße je Nennmaßbereich; Klasse mittel (m): >6–30 → ±0,2 · >30–120 → ±0,3.</p>' +
        '<h3>Passungen (DIN EN ISO 286)</h3><p>Toleranzfeld (Buchstabe) + Qualität (Zahl). <strong>H</strong> = Bohrung mit unterem Abmaß 0. Beispiel Einheitsbohrung: <strong>H7/g6</strong> ergibt eine <strong>Spielpassung</strong> (Welle g6 immer kleiner als Bohrung H7). Große Buchstaben = Bohrung, kleine = Welle.</p>' +
        '<h3>Berechne die Grenzabmaße (ISO 2768-m)</h3>' +
        '<table class="tab"><thead><tr><th>Nennmaß</th><th>Grenzabmaß ±</th></tr></thead><tbody>' +
        '<tr><td>25 mm</td><td>__________</td></tr><tr><td>80 mm</td><td>__________</td></tr><tr><td>12 mm</td><td>__________</td></tr></tbody></table>' +
        '<p class="frage">Frage: Ist H7/g6 eine Spiel-, Übergangs- oder Presspassung? ____________________</p>' +
        '<details class="loesung-box"><summary>Lösung anzeigen</summary><ul class="ul">' +
        '<li>25 mm (>6–30) → ±0,2 mm · 80 mm (>30–120) → ±0,3 mm · 12 mm (>6–30) → ±0,2 mm</li>' +
        '<li>H7/g6 = <strong>Spielpassung</strong> (immer Luft zwischen Welle und Bohrung).</li></ul></details>';
    },
    aufgaben: [
      {
        blattNr: "TZ-131", schwierigkeit: "mittel", woche: 6, typ: "theorie", render: function () {
          return leseAufgabe({
            meta: ["Zeichnung lesen", "Woche 6", "TZ-131"],
            text: "Werte die Passbohrung aus.",
            api: TZ.platte({ benennung: "Passbohrung", nummer: "TZ-131", w: 80, h: 50, t: 12, features: [{ typ: "bohrung", x: 40, y: 25, d: 12, passung: "H9" }] }),
            fragen: ["Welche Passung hat die Bohrung?", "Welche Grenzabmaße ergeben sich (⌀12 H9, IT9 = 43 µm)?", "Welches Prüfmittel nutzt du?"],
            loesungen: ["⌀12 H9.", "oberes Abmaß +0,043 mm, unteres 0 mm (12,000 … 12,043).", "Grenzlehrdorn („Gut“ geht, „Ausschuss“ nicht)."],
          });
        },
      },
    ],
  },
  {
    id: "oberflaeche", titel: "Oberfläche & Schriftfeld", kurz: "Ra (ISO 21920), Schriftfeld (ISO 7200)", theorieWoche: 7,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 7</span><span>EN ISO 21920 / 7200</span></div>' +
        '<h3>Oberflächenangabe</h3><p><strong>Ra</strong> = arithmetischer Mittenrauwert in µm (DIN EN ISO 21920). Kleiner Ra = glatter. Das Grundsymbol ist ein „Haken“ an der bearbeiteten Fläche.</p>' +
        '<h3>Schriftfeld (DIN EN ISO 7200)</h3><p>Enthält u. a. Benennung, Werkstoff, Maßstab, Zeichnungsnummer, Datum/Ersteller, Allgemeintoleranz und das Projektionssymbol.</p>' +
        '<p class="frage">Frage: Was bedeutet eine kleine Ra-Zahl für die Oberfläche? ____________________</p>';
    },
    aufgaben: [
      {
        blattNr: "TZ-141", schwierigkeit: "leicht", woche: 7, typ: "theorie", render: function () {
          return leseAufgabe({
            meta: ["Schriftfeld lesen", "Woche 7", "TZ-141"],
            text: "Lies die Angaben aus dem Schriftfeld ab.",
            api: TZ.platte({ benennung: "Halteplatte", nummer: "GM-190", w: 90, h: 50, t: 15, fase: 2, ra: "3,2", features: [{ typ: "bohrung", x: 25, y: 25, d: 12, passung: "H9" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }),
            fragen: ["Welcher Werkstoff ist angegeben?", "Welche Allgemeintoleranz gilt?", "Wie lautet die Zeichnungsnummer?", "Welche Oberflächenangabe steht an der Vorderseite?"],
            loesungen: ["S235JR.", "ISO 2768-m.", "GM-190.", "Ra 3,2 µm."],
          });
        },
      },
    ],
  },
];

/* ---- Katalog -> bausteine + Lernpfad + Teilgebiete ---- */
(function () {
  var bausteine = [], teilgebiete = [], seq = 0;
  TZ_TG.forEach(function (tg) {
    teilgebiete.push({ id: tg.id, titel: tg.titel, kurz: tg.kurz });
    var thId = "tz-" + tg.id + "-theorie";
    bausteine.push({ id: thId, typ: "theorie", titel: "Theorie: " + tg.titel, blattNr: tg.id.toUpperCase(), teilgebiet: tg.id, teilgebietTitel: tg.titel, schwierigkeit: "—", woche: tg.theorieWoche, seq: seq++, render: (function (t) { return function () { return t.theorie(); }; })(tg) });
    tg.aufgaben.forEach(function (a, i) {
      var id = "tz-" + tg.id + "-" + (i + 1);
      bausteine.push({ id: id, typ: a.typ || "zeichnung", titel: a.blattNr + " — " + tg.titel, blattNr: a.blattNr, teilgebiet: tg.id, teilgebietTitel: tg.titel, schwierigkeit: a.schwierigkeit, woche: a.woche, seq: seq++, render: a.render });
    });
  });
  var lernpfad = bausteine.slice().sort(function (a, b) { return (a.woche - b.woche) || (a.seq - b.seq); }).map(function (b) { return b.id; });
  AZ_CONTENT["m2-technische-kommunikation"] = {
    intro: "Technisches Zeichnen (Lernfeld 1): Zeichnungen lesen und erstellen — Linienarten, Ansichten, Bemaßung, " +
      "Schnitte, Toleranzen & Passungen, Oberflächen und Schriftfeld. Mit Lese- und Ergänzen-Übungen an echten, " +
      "normgerechten Zeichnungen (verknüpft mit den Werkstücken aus dem Grundkurs Metall).",
    teilgebiete: teilgebiete, lernpfad: lernpfad, bausteine: bausteine,
  };
})();
