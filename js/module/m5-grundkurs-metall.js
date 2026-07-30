/* ============================================================================
   Modul-Inhalt: Grundkurs Metall — Aufgaben-Katalog (Generator-basiert)
   Rahmenplan: "Manuelles u. maschinelles Spanen, Trennen und Umformen" (11 Wo.)
   Berufsschule: Lernfeld 2 "Herstellen mechanischer Teilsysteme"
   Aufbau über 11 Wochen: mehrere Aufgaben je Teilgebiet + fortlaufende
   Projekt-Reihe (kleiner Haltewinkel entsteht Schritt für Schritt).
   Werkstücke via AZ.parts (teile.js) -> normgerecht, im Rahmen. Werte belegt.
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

/* ---- Hilfen: Aufgabenstellung, Prüftabelle, Zeichnung mit Umschalter ---- */
function azFeatureText(spec) {
  var map = {}, order = [];
  (spec.features || []).forEach(function (f) {
    var key = f.typ === "gewinde" ? ("Gewinde " + f.gew)
      : ("Bohrung ⌀" + AZ.mm(f.d) + (f.passung ? " " + f.passung : "") + (f.senkung ? " mit Senkung ⌀" + AZ.mm(f.senkung.d) : ""));
    if (!(key in map)) { map[key] = 0; order.push(key); } map[key]++;
  });
  var parts = order.map(function (k) { return (map[k] > 1 ? map[k] + "× " : "") + k; });
  if (spec.fase) parts.push("Fase " + AZ.mm(spec.fase) + "×45°");
  return parts.join(", ");
}
function azAufgabenstellung(api) {
  var s = api.spec;
  var maße = s.w ? (AZ.mm(s.w) + " × " + AZ.mm(s.h) + " × " + AZ.mm(s.t) + " mm")
    : (s.l != null ? ("⌀" + AZ.mm(s.d) + " × " + AZ.mm(s.l) + " mm")
      : ("Schenkel " + AZ.mm(s.a) + " / " + AZ.mm(s.b) + " mm, Dicke " + AZ.mm(s.t) + " mm"));
  var ft = s.features ? azFeatureText(s) : (s.gew ? "Außengewinde " + s.gew : "");
  return "Fertige das Werkstück <strong>" + AZ.esc(s.benennung) + "</strong> nach Zeichnung <em>" + s.nummer +
    "</em> auf Endmaß <strong>" + maße + "</strong>" + (ft ? " mit: " + ft : "") + ". Prüfe die Maße nach Zeichnung.";
}
function azMasseTable(api) {
  var rows = api.masse().map(function (r) {
    return "<tr><td>" + r.name + "</td><td>" + r.soll + "</td><td>" + r.tol + "</td><td>" + r.mittel + "</td><td>______</td><td>☐</td></tr>";
  }).join("");
  return '<table class="tab"><thead><tr><th>Maß</th><th>Sollmaß</th><th>Grenzabmaß</th><th>Prüfmittel</th><th>Ist</th><th>i.O.</th></tr></thead><tbody>' + rows + "</tbody></table>";
}
function azZeichnungBlock(api) {
  return '<div class="aufgabe">' +
    '<div class="z-toggle"><button class="btn small" onclick="this.closest(\'.aufgabe\').classList.toggle(\'erg\')">Fertigzeichnung ⇄ Zum Ergänzen</button></div>' +
    '<div class="zeichnung-halter z-fertig">' + api.svg("fertig") + "</div>" +
    '<div class="zeichnung-halter z-erg">' + api.svg("ergaenzen") + "</div></div>";
}
function azAufgabeRender(aufg) {
  var api = aufg.api;
  return '<div class="bl-meta"><span>' + aufg.teilgebietTitel + '</span><span>Woche ' + aufg.woche + '</span><span>Schwierigkeit: ' + aufg.schwierigkeit + '</span><span>' + aufg.blattNr + '</span></div>' +
    (aufg.hinweis ? '<div class="anknuepf">' + aufg.hinweis + '</div>' : '') +
    '<h3>Aufgabe</h3><p>' + azAufgabenstellung(api) + '</p>' +
    '<h3>Zeichnung</h3>' + azZeichnungBlock(api) +
    '<h3>Prüfmaße</h3>' + azMasseTable(api) +
    '<p class="chk-hint">Grenzabmaße automatisch nach DIN ISO 2768-' + (api.spec.toleranz || "m") + '; Passungen nach DIN EN ISO 286.</p>' +
    '<details class="loesung-box"><summary>Lösung anzeigen</summary>' +
    '<p>Werkstück i.O., wenn alle Istmaße innerhalb der Grenzabmaße liegen, Bohrungen/Gewinde lehrenhaltig und die Kanten gratfrei (ggf. gefast) sind. Musterzeichnung = Fertigzeichnung oben (Umschalter).</p></details>' +
    '<div class="unterschrift"><div>Azubi: __________________</div><div>Ausbilder: __________________</div><div>Datum: ____________</div></div>';
}

/* Lochkreis-Positionen (Teilkreis) berechnen */
function azTeilkreis(cx, cy, r, n, start, d) {
  var arr = [], a0 = (start == null ? 45 : start) * Math.PI / 180;
  for (var i = 0; i < n; i++) { var a = a0 + i * 2 * Math.PI / n; arr.push({ typ: "bohrung", x: +(cx + r * Math.cos(a)).toFixed(1), y: +(cy + r * Math.sin(a)).toFixed(1), d: d }); }
  return arr;
}
var P = AZ.parts;

/* ============================ Teilgebiete + Aufgaben ======================= */
var GM_TG = [
  {
    id: "pruefen", titel: "Prüfen, Anreißen & Messen", kurz: "Messschieber, Mikrometer, Toleranzen",
    theorieWoche: 1,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 1</span><span>Lernfeld 2</span></div>' +
        '<h3>Messschieber (Nonius)</h3><p>Ausführung 1/20 → Ablesegenauigkeit <strong>0,05 mm</strong>, 1/50 → <strong>0,02 mm</strong>. ' +
        'Hauptskala = ganze mm; der Nonius-Strich, der mit einem Hauptstrich fluchtet, gibt die Nachkommastelle.</p>' +
        '<h3>Bügelmessschraube</h3><p>Spindelsteigung 0,5 mm, Trommel 50 Teile → Skalenwert <strong>0,01 mm</strong>. Immer mit Ratsche messen.</p>' +
        '<h3>Toleranz &amp; Anreißen</h3><p>Toleranz = Höchstmaß − Mindestmaß. Ohne Einzeleintrag gilt DIN ISO 2768. Anreißen mit Höhenreißer/Winkel, Bohrmitten <strong>körnen</strong>.</p>' +
        '<p class="frage">Frage: Ablesegenauigkeit Messschieber Nonius 1/50? __________ mm</p>';
    },
    aufgaben: [
      { blattNr: "GM-101", schwierigkeit: "leicht", woche: 1, api: P.platte({ benennung: "Messübung Flachstahl", nummer: "GM-101", w: 60, h: 40, t: 8, schnitt: false, features: [] }) },
      { blattNr: "GM-102", schwierigkeit: "leicht", woche: 1, api: P.platte({ benennung: "Messübung Platte", nummer: "GM-102", w: 75, h: 50, t: 10, schnitt: false, features: [] }) },
      { blattNr: "GM-103", schwierigkeit: "leicht", woche: 2, hinweis: "Reiße die Bohrmitten an und körne sie — noch nicht bohren.", api: P.platte({ benennung: "Anreißübung Lochbild", nummer: "GM-103", w: 100, h: 60, t: 10, features: [{ typ: "bohrung", x: 25, y: 30, d: 8 }, { typ: "bohrung", x: 50, y: 30, d: 8 }, { typ: "bohrung", x: 75, y: 30, d: 8 }] }) },
    ],
  },
  {
    id: "feilen", titel: "Feilen", kurz: "Ebenheit, Winkligkeit, Parallelität",
    theorieWoche: 3,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 3</span><span>Lernfeld 2</span></div>' +
        '<h3>Hieb &amp; Feilenarten</h3><p>Schrupphieb (1–2) für Abtrag, Schlichthieb (3–4) für die Endbearbeitung. Formen: Flach-, Vierkant-, Rund-, Dreikant-, Halbrundfeile.</p>' +
        '<h3>Prüfen</h3><p>Ebenheit im Kreuzhieb mit Haarlineal (Lichtspalt), Winkligkeit/Rechtwinkligkeit mit dem Haarwinkel gegen das Licht, Parallelität mit dem Messschieber an mehreren Stellen.</p>' +
        '<p class="frage">Frage: Womit prüfst du die Rechtwinkligkeit zweier Flächen? _______________________________</p>';
    },
    aufgaben: [
      { blattNr: "GM-111", schwierigkeit: "leicht", woche: 3, api: P.platte({ benennung: "Feilübung Ebenheit", nummer: "GM-111", w: 60, h: 40, t: 10, schnitt: false, features: [] }) },
      { blattNr: "GM-112", schwierigkeit: "mittel", woche: 3, api: P.platte({ benennung: "Feilübung Winkligkeit", nummer: "GM-112", w: 50, h: 50, t: 12, schnitt: false, features: [] }) },
      { blattNr: "GM-113", schwierigkeit: "mittel", woche: 4, hinweis: "Feinbearbeitung: engere Toleranz (ISO 2768-f).", api: P.platte({ benennung: "Passfläche (fein)", nummer: "GM-113", toleranz: "f", w: 50, h: 50, t: 10, schnitt: false, features: [] }) },
      { blattNr: "GM-114", schwierigkeit: "mittel", woche: 4, api: P.platte({ benennung: "Feilübung Parallelität", nummer: "GM-114", w: 70, h: 30, t: 10, schnitt: false, features: [] }) },
    ],
  },
  {
    id: "saegen", titel: "Sägen", kurz: "Zahnteilung, Ablängen",
    theorieWoche: 5,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 5</span><span>Lernfeld 2</span></div>' +
        '<h3>Sägeblatt</h3><p>Faustregel: mindestens <strong>3 Zähne</strong> gleichzeitig im Eingriff — sonst hakt und bricht der Zahn. Dünnes Material → feine Zahnteilung. Die <strong>Schränkung</strong> gibt Freischnitt.</p>' +
        '<h3>Ablängen</h3><p>Auf Anriss sägen, Materialzugabe zum Nacharbeiten (Feilen) lassen.</p>' +
        '<p class="frage">Frage: Warum müssen mindestens 3 Zähne im Eingriff sein? _______________________________</p>';
    },
    aufgaben: [
      { blattNr: "GM-121", schwierigkeit: "leicht", woche: 5, api: P.platte({ benennung: "Sägeübung Ablängen", nummer: "GM-121", w: 80, h: 30, t: 8, schnitt: false, features: [] }) },
      { blattNr: "GM-122", schwierigkeit: "leicht", woche: 5, api: P.platte({ benennung: "Sägeübung Leiste", nummer: "GM-122", w: 100, h: 25, t: 6, schnitt: false, features: [] }) },
    ],
  },
  {
    id: "bohren", titel: "Bohren & Senken", kurz: "Drehzahl, Lochbilder, Senkung, Passung",
    theorieWoche: 6,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 6</span><span>Lernfeld 2</span></div>' +
        '<h3>Drehzahl</h3><p class="formel">n = (v<sub>c</sub> · 1000) / (π · d) [min<sup>-1</sup>]</p><p>Richtwert HSS in S235: v<sub>c</sub> ≈ 35 m/min <span class="chk-hint">(Tabellenbuch prüfen)</span>.</p>' +
        '<h3>Senken &amp; Reiben</h3><p>90°-Kegelsenker für Senkschrauben und zum Entgraten. Passbohrungen (H-Toleranz) werden nach dem Bohren <strong>gerieben</strong>.</p>' +
        '<p class="frage">Frage 1: n für ⌀8 bei v<sub>c</sub>=35? __________ min<sup>-1</sup></p>' +
        '<p class="frage">Frage 2: Womit stellst du eine Passbohrung ⌀12 H9 genau her? __________</p>';
    },
    aufgaben: [
      { blattNr: "GM-131", schwierigkeit: "leicht", woche: 6, api: P.platte({ benennung: "Lochplatte 3×⌀8", nummer: "GM-131", w: 120, h: 60, t: 10, features: [{ typ: "bohrung", x: 25, y: 30, d: 8 }, { typ: "bohrung", x: 60, y: 30, d: 8 }, { typ: "bohrung", x: 95, y: 30, d: 8 }] }) },
      { blattNr: "GM-132", schwierigkeit: "leicht", woche: 6, api: P.platte({ benennung: "Lochreihe 4×⌀6", nummer: "GM-132", w: 100, h: 40, t: 10, features: [{ typ: "bohrung", x: 20, y: 20, d: 6 }, { typ: "bohrung", x: 40, y: 20, d: 6 }, { typ: "bohrung", x: 60, y: 20, d: 6 }, { typ: "bohrung", x: 80, y: 20, d: 6 }] }) },
      { blattNr: "GM-133", schwierigkeit: "mittel", woche: 7, hinweis: "Teilkreis: 4 Bohrungen gleichmäßig auf einem Lochkreis ⌀60.", api: P.platte({ benennung: "Lochkreis 4×⌀6,6", nummer: "GM-133", w: 90, h: 90, t: 10, features: azTeilkreis(45, 45, 30, 4, 45, 6.6) }) },
      { blattNr: "GM-134", schwierigkeit: "mittel", woche: 7, api: P.platte({ benennung: "Senkplatte", nummer: "GM-134", w: 80, h: 50, t: 12, features: [{ typ: "bohrung", x: 40, y: 25, d: 9, senkung: { d: 18 } }] }) },
      { blattNr: "GM-135", schwierigkeit: "schwer", woche: 7, api: P.platte({ benennung: "Passbohrung ⌀12 H9", nummer: "GM-135", w: 80, h: 50, t: 12, features: [{ typ: "bohrung", x: 40, y: 25, d: 12, passung: "H9" }] }) },
    ],
  },
  {
    id: "gewinde", titel: "Gewindeschneiden", kurz: "Innen-/Außengewinde, Kernloch",
    theorieWoche: 8,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 8</span><span>Lernfeld 2</span></div>' +
        '<h3>Innengewinde</h3><p>Gewindebohrer-Satz: Vor-, Mittel-, Fertigschneider. Vorher Kernloch bohren; Faustformel Kernloch-⌀ ≈ d − P.</p>' +
        '<table class="tab"><thead><tr><th>Gewinde</th><th>Steigung P</th><th>Kernloch-⌀ (DIN 13)</th></tr></thead><tbody>' +
        '<tr><td>M5</td><td>0,80</td><td>4,2</td></tr><tr><td>M6</td><td>1,00</td><td>5,0</td></tr>' +
        '<tr><td>M8</td><td>1,25</td><td>6,8</td></tr><tr><td>M10</td><td>1,50</td><td>8,5</td></tr></tbody></table>' +
        '<h3>Außengewinde</h3><p>Mit dem Schneideisen auf einen angefasten Bolzen; regelmäßig zurückdrehen (Span brechen), schneidölen.</p>' +
        '<p class="frage">Frage: Kernloch-⌀ für M8? __________ mm (8 − 1,25 = ____)</p>';
    },
    aufgaben: [
      { blattNr: "GM-141", schwierigkeit: "mittel", woche: 8, api: P.platte({ benennung: "Gewindeplatte M6", nummer: "GM-141", w: 80, h: 50, t: 15, features: [{ typ: "gewinde", x: 25, y: 25, gew: "M6" }, { typ: "gewinde", x: 55, y: 25, gew: "M6" }] }) },
      { blattNr: "GM-142", schwierigkeit: "mittel", woche: 8, api: P.platte({ benennung: "Gewindeplatte M6/M8", nummer: "GM-142", w: 90, h: 50, t: 15, features: [{ typ: "gewinde", x: 30, y: 25, gew: "M6" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }) },
      { blattNr: "GM-143", schwierigkeit: "mittel", woche: 9, api: P.platte({ benennung: "Gewindeplatte 4×M6", nummer: "GM-143", w: 100, h: 60, t: 15, features: [{ typ: "gewinde", x: 25, y: 30, gew: "M6" }, { typ: "gewinde", x: 50, y: 30, gew: "M6" }, { typ: "gewinde", x: 75, y: 30, gew: "M6" }, { typ: "gewinde", x: 50, y: 45, gew: "M6" }] }) },
      { blattNr: "GM-144", schwierigkeit: "mittel", woche: 9, api: P.bolzen({ benennung: "Bolzen Außengewinde M10", nummer: "GM-144", d: 10, l: 60, gew: "M10", fase: 1.5 }) },
    ],
  },
  {
    id: "biegen", titel: "Biegen", kurz: "Abkanten, Biegeradius, Winkel",
    theorieWoche: 10,
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Woche 10</span><span>Lernfeld 2</span></div>' +
        '<h3>Biegen / Abkanten</h3><p>Die <strong>neutrale Faser</strong> bleibt längenkonstant → daraus wird die <strong>gestreckte Länge</strong> berechnet. Der <strong>Biegeradius</strong> darf nicht zu klein sein (Rissgefahr). Nach dem Biegen federt das Blech zurück (<strong>Rückfederung</strong>) — etwas überbiegen.</p>' +
        '<p class="frage">Frage: Was bleibt beim Biegen längenkonstant? _______________________________</p>';
    },
    aufgaben: [
      { blattNr: "GM-151", schwierigkeit: "mittel", woche: 10, api: P.biegeteil({ benennung: "Biegewinkel 90°", nummer: "GM-151", a: 60, b: 40, t: 3, r: 3, winkel: 90 }) },
      { blattNr: "GM-152", schwierigkeit: "mittel", woche: 10, api: P.biegeteil({ benennung: "Biegewinkel groß", nummer: "GM-152", a: 80, b: 50, t: 4, r: 4, winkel: 90 }) },
    ],
  },
  {
    id: "projekt", titel: "Projekt: Haltewinkel", kurz: "Fortlaufend — kleines Werkstück entsteht",
    theorieWoche: 3,
    theorie: function () {
      return '<div class="bl-meta"><span>Projekt</span><span>Woche 3–11</span><span>fortlaufend</span></div>' +
        '<h3>Projekt-Reihe: kleiner Haltewinkel</h3><p>Über mehrere Wochen entsteht Schritt für Schritt ein komplettes Werkstück — jede Aufgabe baut auf der vorherigen auf:</p>' +
        '<ol class="ol"><li><strong>P1 (Woche 3):</strong> Grundplatte feilen</li><li><strong>P2 (Woche 6):</strong> Bohrbild in die Grundplatte</li>' +
        '<li><strong>P3 (Woche 10):</strong> Anbauwinkel biegen</li><li><strong>P4 (Woche 11):</strong> Montage &amp; Prüfung</li></ol>' +
        '<p class="chk-hint">Bewahre die Teile auf — am Ende werden sie verschraubt.</p>';
    },
    aufgaben: [
      { id: "gm-proj-1", blattNr: "GM-P1", schwierigkeit: "leicht", woche: 3, hinweis: "Projektstart: Diese Grundplatte wird in P2–P4 weiterverarbeitet.", api: P.platte({ benennung: "Haltewinkel — Grundplatte", nummer: "GM-P1", w: 80, h: 50, t: 10, schnitt: false, features: [] }) },
      { id: "gm-proj-2", blattNr: "GM-P2", schwierigkeit: "mittel", woche: 6, hinweis: "Baut auf GM-P1 auf: Bohre 2 Durchgangslöcher ⌀6,6 (für Schrauben M6) in die Grundplatte.", api: P.platte({ benennung: "Haltewinkel — Grundplatte gebohrt", nummer: "GM-P2", w: 80, h: 50, t: 10, features: [{ typ: "bohrung", x: 20, y: 25, d: 6.6 }, { typ: "bohrung", x: 60, y: 25, d: 6.6 }] }) },
      { id: "gm-proj-3", blattNr: "GM-P3", schwierigkeit: "mittel", woche: 10, hinweis: "Baut auf das Projekt auf: Biege den Anbauwinkel; die Bohrungen passen zur Grundplatte GM-P2.", api: P.biegeteil({ benennung: "Haltewinkel — Anbauwinkel", nummer: "GM-P3", a: 60, b: 40, t: 4, r: 4, winkel: 90 }) },
      {
        id: "gm-proj-4", blattNr: "GM-P4", schwierigkeit: "mittel", woche: 11, typ: "praxis",
        render: function () {
          return '<div class="bl-meta"><span>Projekt · Montage</span><span>Woche 11</span><span>Abschluss</span></div>' +
            '<div class="anknuepf">Baut auf GM-P1/P2/P3 auf: die gefertigten Teile werden zum Haltewinkel montiert.</div>' +
            '<h3>Montage</h3>' +
            '<div class="chk"><span class="box"></span>Grundplatte (GM-P2) und Anbauwinkel (GM-P3) entgraten</div>' +
            '<div class="chk"><span class="box"></span>Winkel auf die Grundplatte setzen, Bohrungen fluchten</div>' +
            '<div class="chk"><span class="box"></span>mit 2× Schraube M6 verschrauben</div>' +
            '<h3>Endprüfung</h3>' +
            '<table class="tab"><thead><tr><th>Prüfmerkmal</th><th>Sollwert</th><th>Prüfmittel</th><th>i.O.</th></tr></thead><tbody>' +
            '<tr><td>Rechtwinkligkeit Winkel/Platte</td><td>90° ±1°</td><td>Haarwinkel</td><td>☐</td></tr>' +
            '<tr><td>Schrauben fest, bündig</td><td>—</td><td>Sicht</td><td>☐</td></tr>' +
            '<tr><td>Kanten gratfrei</td><td>—</td><td>Sicht/Tasten</td><td>☐</td></tr></tbody></table>' +
            '<div class="unterschrift"><div>Azubi: __________________</div><div>Ausbilder: __________________</div><div>Datum: ____________</div></div>';
        },
      },
    ],
  },
  {
    id: "uebung", titel: "Prüfungsstück", kurz: "Alles kombiniert",
    theorieWoche: 11,
    theorie: function () {
      return '<div class="bl-meta"><span>Zusammenfassung</span><span>Woche 11</span></div>' +
        '<h3>Kombiniertes Werkstück</h3><p>Das Prüfungsstück vereint alle Fertigkeiten: feilen auf Endmaß, Passbohrung reiben, Gewinde schneiden, Kanten fasen und mit den richtigen Prüfmitteln kontrollieren (Messschieber, Grenzlehrdorn, Gewindelehre).</p>';
    },
    aufgaben: [
      { blattNr: "GM-190", schwierigkeit: "schwer", woche: 11, api: P.platte({ benennung: "Halteplatte (Prüfungsstück)", nummer: "GM-190", w: 90, h: 50, t: 15, fase: 2, ra: "3,2", features: [{ typ: "bohrung", x: 25, y: 25, d: 12, passung: "H9" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }) },
    ],
  },
];

/* ---- Katalog -> bausteine + Lernpfad (chronologisch) + Teilgebiete ---- */
(function () {
  var bausteine = [], teilgebiete = [], seq = 0;
  GM_TG.forEach(function (tg) {
    teilgebiete.push({ id: tg.id, titel: tg.titel, kurz: tg.kurz });
    var thId = tg.id + "-theorie";
    bausteine.push({ id: thId, typ: "theorie", titel: "Theorie: " + tg.titel, blattNr: tg.id.toUpperCase(), teilgebiet: tg.id, teilgebietTitel: tg.titel, schwierigkeit: "—", woche: tg.theorieWoche, seq: seq++, render: (function (t) { return function () { return t.theorie(); }; })(tg) });
    tg.aufgaben.forEach(function (a, i) {
      var id = a.id || (tg.id + "-" + (i + 1));
      a.teilgebiet = tg.id; a.teilgebietTitel = tg.titel;
      var titel = a.api ? (a.api.spec.benennung + " (" + a.blattNr + ")") : (a.blattNr + " — Montage & Prüfung");
      bausteine.push({ id: id, typ: a.typ || "zeichnung", titel: titel, blattNr: a.blattNr, teilgebiet: tg.id, teilgebietTitel: tg.titel, schwierigkeit: a.schwierigkeit, woche: a.woche, seq: seq++, render: (function (au) { return function () { return au.render ? au.render() : azAufgabeRender(au); }; })(a) });
    });
  });
  // Lernpfad chronologisch nach Woche, dann Reihenfolge
  var lernpfad = bausteine.slice().sort(function (a, b) { return (a.woche - b.woche) || (a.seq - b.seq); }).map(function (b) { return b.id; });

  AZ_CONTENT["m5-grundkurs-metall"] = {
    intro: "Kompletter Grundkurs Metall über 11 Wochen (Lernfeld 2): Prüfen, Feilen, Sägen, Bohren, Gewinde, Biegen — " +
      "plus eine fortlaufende Projekt-Reihe, aus der Schritt für Schritt ein Haltewinkel entsteht. Jede Zeichnung ist " +
      "normgerecht (DIN ISO 128/129/5455/286, ISO 2768), maßstäblich, als Fertigzeichnung oder „zum Ergänzen“ druckbar; " +
      "Prüfmaße werden automatisch abgeleitet.",
    teilgebiete: teilgebiete,
    lernpfad: lernpfad,
    bausteine: bausteine,
  };
})();
