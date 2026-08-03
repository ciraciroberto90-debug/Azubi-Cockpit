/* ============================================================================
   Gemeinsame Render-Helfer für Modul-Inhalte (Aufgaben, Prüftabellen,
   Zeichnung mit Umschalter, "Zeichnung lesen", Messschieber-Ablesung).
   Wird VOR den Modul-Dateien geladen.
   ==========================================================================*/

/* Merkmalstext einer Werkstückbeschreibung (gruppiert gleiche Bohrungen) */
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
/* Lochkreis-Positionen (Teilkreis) */
function azTeilkreis(cx, cy, r, n, start, d) {
  var arr = [], a0 = (start == null ? 45 : start) * Math.PI / 180;
  for (var i = 0; i < n; i++) { var a = a0 + i * 2 * Math.PI / n; arr.push({ typ: "bohrung", x: +(cx + r * Math.cos(a)).toFixed(1), y: +(cy + r * Math.sin(a)).toFixed(1), d: d }); }
  return arr;
}

/* "Zeichnung lesen" — Fertigzeichnung + Fragen + Lösung
   cfg:{api, text, fragen:[..], loesungen:[..], meta:[..], hinweis}          */
function leseAufgabe(cfg) {
  var meta = (cfg.meta || []).map(function (m) { return "<span>" + m + "</span>"; }).join("");
  var fragen = (cfg.fragen || []).map(function (q, i) { return '<p class="frage">Frage ' + (i + 1) + ": " + q + " ____________________</p>"; }).join("");
  var los = (cfg.loesungen || []).map(function (l) { return "<li>" + l + "</li>"; }).join("");
  return '<div class="bl-meta">' + meta + "</div>" +
    (cfg.hinweis ? '<div class="anknuepf">' + cfg.hinweis + "</div>" : "") +
    "<h3>Aufgabe: Zeichnung lesen</h3><p>" + (cfg.text || "Lies die Zeichnung und beantworte die Fragen.") + "</p>" +
    '<div class="zeichnung-halter">' + cfg.api.svg("fertig") + "</div>" +
    fragen +
    '<details class="loesung-box"><summary>Lösung anzeigen</summary><ol class="ol">' + los + "</ol></details>";
}

/* Messschieber-Ablesung (Nonius 1/20 = 0,05 mm), korrekt konstruiert.
   value als Vielfaches von 0,05. Liefert ein eigenständiges SVG.            */
function azMessschieber(value) {
  var N = Math.floor(value), m = Math.round((value - N) / 0.05); // 0..19
  var PXmm = 7, y0 = 26, yN = 44, hpad = 12;
  var mmMax = N + 44;
  var W = mmMax * PXmm + hpad * 2, H = 68;
  function X(mm) { return (hpad + mm * PXmm).toFixed(1); }
  var s = '<svg viewBox="0 0 ' + W.toFixed(0) + ' ' + H + '" class="msch" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">';
  s += '<style>.mm{stroke:#1a1a1a;stroke-width:0.8}.mm5{stroke:#1a1a1a;stroke-width:1}.non{stroke:#1a1a1a;stroke-width:0.8}' +
    '.hit{stroke:#E4531D;stroke-width:1.6}.ptr{stroke:#E4531D;stroke-width:1}.txt{font-family:ui-monospace,monospace;font-size:7px;fill:#1a1a1a}' +
    '.txt2{font-family:ui-monospace,monospace;font-size:6px;fill:#666}.bar{fill:#f0efe9;stroke:#1a1a1a;stroke-width:0.6}</style>';
  s += '<rect x="' + hpad + '" y="' + (y0 - 14) + '" width="' + (mmMax * PXmm) + '" height="12" class="bar"/>';
  // Hauptskala (mm)
  for (var mm = 0; mm <= mmMax; mm++) {
    var big = (mm % 10 === 0), mid = (mm % 5 === 0);
    var hgt = big ? 12 : (mid ? 8 : 5);
    s += '<line x1="' + X(mm) + '" y1="' + (y0 - 2) + '" x2="' + X(mm) + '" y2="' + (y0 - 2 - hgt) + '" class="' + (mid ? "mm5" : "mm") + '"/>';
    if (big) s += '<text x="' + X(mm) + '" y="' + (y0 - 15) + '" text-anchor="middle" class="txt2">' + (mm / 10) + '</text>';
  }
  // Nonius-Träger
  s += '<rect x="' + X(value) + '" y="' + (yN - 2) + '" width="' + (39 * PXmm) + '" height="12" class="bar"/>';
  for (var k = 0; k <= 20; k++) {
    var nx = value + k * 1.95;
    var cls = (k === m) ? "hit" : "non";
    s += '<line x1="' + X(nx) + '" y1="' + (yN) + '" x2="' + X(nx) + '" y2="' + (yN + 8) + '" class="' + cls + '"/>';
    if (k % 5 === 0) s += '<text x="' + X(nx) + '" y="' + (yN + 16) + '" text-anchor="middle" class="txt2">' + (k / 2) + '</text>';
  }
  // Zeiger (Nonius-Null) + Markierung der koinzidierenden Linie
  s += '<line x1="' + X(value) + '" y1="' + (y0 - 2) + '" x2="' + X(value) + '" y2="' + (yN + 8) + '" class="ptr" stroke-dasharray="2 1.5"/>';
  s += '</svg>';
  return s;
}
