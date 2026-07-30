/* ============================================================================
   Modul-Inhalt: Grundkurs Metall — Aufgaben-Katalog (Generator-basiert)
   Rahmenplan: "Manuelles u. maschinelles Spanen, Trennen und Umformen" (11 Wo.)
   Berufsschule: Lernfeld 2 "Herstellen mechanischer Teilsysteme"
   Werkstücke werden über AZ.parts (teile.js) erzeugt -> normgerecht, im Rahmen.
   Werte belegt: DIN 13, DIN EN ISO 286 (H9/IT9), DIN ISO 2768-1.
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

/* ---- Hilfsfunktionen: Aufgabenstellung, Prüftabelle, Zeichnung mit Umschalter ---- */
function azFeatureText(spec) {
  var parts = [];
  (spec.features || []).forEach(function (f) {
    if (f.typ === "gewinde") parts.push("Gewinde " + f.gew);
    else parts.push("Bohrung ⌀" + AZ.mm(f.d) + (f.passung ? " " + f.passung : "") + (f.senkung ? " mit Senkung ⌀" + AZ.mm(f.senkung.d) : ""));
  });
  if (spec.fase) parts.push("Fase " + AZ.mm(spec.fase) + "×45°");
  return parts.join(", ");
}
function azAufgabenstellung(api) {
  var s = api.spec;
  var maße = s.w ? (AZ.mm(s.w) + " × " + AZ.mm(s.h) + " × " + AZ.mm(s.t) + " mm")
    : ("Schenkel " + AZ.mm(s.a) + " / " + AZ.mm(s.b) + " mm, Dicke " + AZ.mm(s.t) + " mm");
  var ft = s.features ? azFeatureText(s) : "";
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
    '<div class="zeichnung-halter z-erg">' + api.svg("ergaenzen") + "</div>" +
    "</div>";
}
/* vollständiges Aufgaben-Blatt: Aufgabe + Zeichnung + Prüfmaße + Lösung */
function azAufgabeRender(aufg) {
  var api = aufg.api;
  return '' +
    '<div class="bl-meta"><span>' + aufg.teilgebietTitel + '</span><span>Schwierigkeit: ' + aufg.schwierigkeit + '</span><span>' + aufg.blattNr + '</span></div>' +
    '<h3>Aufgabe</h3><p>' + azAufgabenstellung(api) + '</p>' +
    '<h3>Zeichnung</h3>' + azZeichnungBlock(api) +
    '<h3>Prüfmaße</h3>' + azMasseTable(api) +
    '<p class="chk-hint">Grenzabmaße automatisch nach DIN ISO 2768-' + (api.spec.toleranz || "m") + '; Passungen nach DIN EN ISO 286.</p>' +
    '<details class="loesung-box"><summary>Lösung anzeigen</summary>' +
    '<p>Werkstück i.O., wenn alle Istmaße innerhalb der angegebenen Grenzabmaße liegen, Bohrungen/Gewinde lehrenhaltig sind und die Kanten gratfrei (ggf. gefast) sind.</p>' +
    '<p class="chk-hint">Musterlösung der Zeichnung = Fertigzeichnung oben (Umschalter).</p></details>' +
    '<div class="unterschrift"><div>Azubi: __________________</div><div>Ausbilder: __________________</div><div>Datum: ____________</div></div>';
}

/* ============================ Teilgebiete + Aufgaben ======================= */
var GM_TG = [
  {
    id: "pruefen", titel: "Prüfen, Anreißen & Messen", kurz: "Messschieber, Mikrometer, Toleranzen, Anreißen",
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Lernfeld 2</span></div>' +
        '<h3>Messschieber (Nonius)</h3><p>Der Nonius erlaubt genaues Ablesen: Ausführung 1/20 → Ablesegenauigkeit <strong>0,05 mm</strong>, ' +
        '1/50 → <strong>0,02 mm</strong>. Hauptskala = ganze mm, Nonius-Strich, der mit einem Hauptstrich fluchtet = Nachkommastelle.</p>' +
        '<h3>Bügelmessschraube (Mikrometer)</h3><p>Spindelsteigung 0,5 mm, Skalentrommel in 50 Teile → Skalenwert <strong>0,01 mm</strong>. ' +
        'Für genaue Außenmaße; immer mit Ratsche/Gefühlsschraube messen.</p>' +
        '<h3>Toleranz</h3><p>Toleranz = Höchstmaß − Mindestmaß. Allgemeintoleranzen ohne Einzeleintrag: DIN ISO 2768 (fein/mittel/grob).</p>' +
        '<h3>Anreißen</h3><p>Mit Höhenreißer/Reißnadel und Anschlagwinkel anreißen, Bohrmitten <strong>körnen</strong>, damit der Bohrer nicht verläuft.</p>' +
        '<p class="frage">Frage: Welche Ablesegenauigkeit hat ein Messschieber mit Nonius 1/50? __________ mm</p>';
    },
    aufgaben: [
      { id: "gm-mess-1", blattNr: "GM-105", schwierigkeit: "leicht",
        api: AZ.parts.platte({ benennung: "Messübung", nummer: "GM-105", w: 60, h: 40, t: 8, schnitt: false, features: [] }) },
    ],
  },
  {
    id: "feilen", titel: "Feilen", kurz: "Ebene Flächen, Winkligkeit, Endmaß",
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Lernfeld 2</span></div>' +
        '<h3>Feilenarten &amp; Hieb</h3><p>Schrupphieb (Hieb 1–2) für groben Abtrag, Schlichthieb (Hieb 3–4) für die Endbearbeitung. ' +
        'Feilenformen: Flach-, Vierkant-, Rund-, Dreikant-, Halbrundfeile.</p>' +
        '<h3>Ebenheit &amp; Winkligkeit prüfen</h3><p>Ebenheit im Kreuzhieb mit Haarlineal (Lichtspalt), Winkligkeit mit dem ' +
        'Haarwinkel gegen das Licht. Endmaß mit Messschieber prüfen.</p>' +
        '<p class="frage">Frage: Womit prüfst du die Winkligkeit zweier Flächen? _______________________________</p>';
    },
    aufgaben: [
      { id: "gm-feil-1", blattNr: "GM-111", schwierigkeit: "leicht",
        api: AZ.parts.platte({ benennung: "Feilübung Ebenheit", nummer: "GM-111", w: 60, h: 40, t: 10, schnitt: false, features: [] }) },
      { id: "gm-feil-2", blattNr: "GM-112", schwierigkeit: "mittel", toleranz: "f",
        api: AZ.parts.platte({ benennung: "Passfläche (fein)", nummer: "GM-112", toleranz: "f", w: 50, h: 50, t: 12, schnitt: false, features: [] }) },
    ],
  },
  {
    id: "saegen", titel: "Sägen", kurz: "Zahnteilung, Ablängen",
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Lernfeld 2</span></div>' +
        '<h3>Sägeblatt wählen</h3><p>Faustregel: mindestens <strong>3 Zähne</strong> gleichzeitig im Eingriff — sonst hakt und bricht der Zahn. ' +
        'Dünne Werkstücke → feine Zahnteilung. Die <strong>Schränkung</strong> sorgt für Freischnitt.</p>' +
        '<h3>Ablängen</h3><p>Auf Anriss sägen, Materialzugabe zum Nacharbeiten (Feilen) lassen.</p>' +
        '<p class="frage">Frage: Warum müssen mindestens 3 Zähne im Eingriff sein? _______________________________</p>';
    },
    aufgaben: [
      { id: "gm-saeg-1", blattNr: "GM-121", schwierigkeit: "leicht",
        api: AZ.parts.platte({ benennung: "Sägeübung Ablängen", nummer: "GM-121", w: 80, h: 30, t: 8, schnitt: false, features: [] }) },
    ],
  },
  {
    id: "bohren", titel: "Bohren & Senken", kurz: "Drehzahl, Kernloch, Senkung",
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Lernfeld 2</span></div>' +
        '<h3>Drehzahl berechnen</h3><p class="formel">n = (v<sub>c</sub> · 1000) / (π · d) [min<sup>-1</sup>]</p>' +
        '<p>Richtwert HSS in S235: v<sub>c</sub> ≈ 35 m/min <span class="chk-hint">(Tabellenbuch prüfen)</span>.</p>' +
        '<h3>Senken</h3><p>90°-Kegelsenker für Senkschrauben; Entgraten der Bohrung ebenfalls mit dem Senker.</p>' +
        '<p class="frage">Frage 1: Berechne n für ⌀10 bei v<sub>c</sub> = 35 m/min. n = __________ min<sup>-1</sup></p>' +
        '<p class="frage">Frage 2: Welchen Senker nutzt du für eine Senkschraube M6? __________</p>';
    },
    aufgaben: [
      { id: "gm-bohr-1", blattNr: "GM-131", schwierigkeit: "leicht",
        api: AZ.parts.platte({ benennung: "Lochplatte 3×⌀8", nummer: "GM-131", w: 120, h: 60, t: 10, features: [{ typ: "bohrung", x: 25, y: 30, d: 8 }, { typ: "bohrung", x: 60, y: 30, d: 8 }, { typ: "bohrung", x: 95, y: 30, d: 8 }] }) },
      { id: "gm-bohr-2", blattNr: "GM-132", schwierigkeit: "mittel",
        api: AZ.parts.platte({ benennung: "Senkplatte", nummer: "GM-132", w: 80, h: 50, t: 12, features: [{ typ: "bohrung", x: 40, y: 25, d: 9, senkung: { d: 18 } }] }) },
    ],
  },
  {
    id: "gewinde", titel: "Gewindeschneiden", kurz: "Innen-/Außengewinde, Kernloch",
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Lernfeld 2</span></div>' +
        '<h3>Innengewinde</h3><p>Gewindebohrer-Satz: Vor-, Mittel- und Fertigschneider. Vorher Kernloch bohren. ' +
        'Faustformel Kernloch-⌀ ≈ d − P (Nenndurchmesser minus Steigung).</p>' +
        '<table class="tab"><thead><tr><th>Gewinde</th><th>Steigung P</th><th>Kernloch-⌀ (DIN 13)</th></tr></thead><tbody>' +
        '<tr><td>M5</td><td>0,80</td><td>4,2</td></tr><tr><td>M6</td><td>1,00</td><td>5,0</td></tr>' +
        '<tr><td>M8</td><td>1,25</td><td>6,8</td></tr><tr><td>M10</td><td>1,50</td><td>8,5</td></tr></tbody></table>' +
        '<h3>Außengewinde</h3><p>Mit dem Schneideisen auf einen angefasten Bolzen; regelmäßig zurückdrehen (Span brechen), schneidölen.</p>' +
        '<p class="frage">Frage: Welchen Kernloch-⌀ bohrst du für M8? __________ mm (Rechnung: 8 − 1,25 = ____)</p>';
    },
    aufgaben: [
      { id: "gm-gew-1", blattNr: "GM-141", schwierigkeit: "mittel",
        api: AZ.parts.platte({ benennung: "Gewindeplatte M6/M8", nummer: "GM-141", w: 90, h: 50, t: 15, features: [{ typ: "gewinde", x: 30, y: 25, gew: "M6" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }) },
    ],
  },
  {
    id: "biegen", titel: "Biegen", kurz: "Abkanten, Biegeradius, Winkel",
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Lernfeld 2</span></div>' +
        '<h3>Biegen / Abkanten</h3><p>Beim Biegen bleibt die <strong>neutrale Faser</strong> längenkonstant; daraus wird die ' +
        '<strong>gestreckte Länge</strong> des Rohteils berechnet. Der <strong>Biegeradius</strong> darf nicht zu klein sein (Rissgefahr). ' +
        'Nach dem Biegen federt das Blech leicht zurück (<strong>Rückfederung</strong>) — Winkel etwas überbiegen.</p>' +
        '<p class="frage">Frage: Was bleibt beim Biegen längenkonstant? _______________________________</p>';
    },
    aufgaben: [
      { id: "gm-bieg-1", blattNr: "GM-151", schwierigkeit: "mittel",
        api: AZ.parts.biegeteil({ benennung: "Biegewinkel 90°", nummer: "GM-151", a: 60, b: 40, t: 3, r: 3, winkel: 90 }) },
    ],
  },
  {
    id: "uebung", titel: "Übungs-/Prüfungsstück", kurz: "Alles kombiniert",
    theorie: function () {
      return '<div class="bl-meta"><span>Theorie</span><span>Zusammenfassung</span></div>' +
        '<h3>Kombiniertes Werkstück</h3><p>Das Prüfungsstück vereint alle Fertigkeiten: feilen auf Endmaß, Passbohrung reiben, Gewinde schneiden, ' +
        'Kanten fasen und die Maße mit den richtigen Prüfmitteln kontrollieren (Messschieber, Grenzlehrdorn, Gewindelehre).</p>';
    },
    aufgaben: [
      { id: "gm-uebung-1", blattNr: "GM-101", schwierigkeit: "schwer",
        api: AZ.parts.platte({ benennung: "Halteplatte", nummer: "GM-101", w: 90, h: 50, t: 15, fase: 2, ra: "3,2", features: [{ typ: "bohrung", x: 25, y: 25, d: 12, passung: "H9" }, { typ: "gewinde", x: 65, y: 25, gew: "M8" }] }) },
    ],
  },
];

/* ---- Katalog in bausteine + Lernpfad + Teilgebiete überführen ---- */
(function () {
  var bausteine = [], lernpfad = [], teilgebiete = [];
  GM_TG.forEach(function (tg) {
    teilgebiete.push({ id: tg.id, titel: tg.titel, kurz: tg.kurz });
    var thId = tg.id + "-theorie";
    bausteine.push({ id: thId, typ: "theorie", titel: "Theorie: " + tg.titel, blattNr: tg.id.toUpperCase(), teilgebiet: tg.id, teilgebietTitel: tg.titel, schwierigkeit: "—", render: (function (t) { return function () { return t.theorie(); }; })(tg) });
    lernpfad.push(thId);
    tg.aufgaben.forEach(function (a) {
      a.teilgebiet = tg.id; a.teilgebietTitel = tg.titel; a.typ = "zeichnung";
      bausteine.push({ id: a.id, typ: "zeichnung", titel: a.api.spec.benennung + " (" + a.blattNr + ")", blattNr: a.blattNr, teilgebiet: tg.id, teilgebietTitel: tg.titel, schwierigkeit: a.schwierigkeit, render: (function (au) { return function () { return azAufgabeRender(au); }; })(a) });
      lernpfad.push(a.id);
    });
  });
  AZ_CONTENT["m5-grundkurs-metall"] = {
    intro: "Kompletter Grundkurs Metall (Lernfeld 2): Prüfen, Feilen, Sägen, Bohren, Gewinde, Biegen und ein " +
      "kombiniertes Prüfungsstück. Jede Zeichnung ist normgerecht (DIN ISO 128/129/5455/286, ISO 2768), maßstäblich " +
      "und lässt sich als Fertigzeichnung oder „zum Ergänzen“ drucken. Prüfmaße werden automatisch abgeleitet.",
    teilgebiete: teilgebiete,
    lernpfad: lernpfad,
    bausteine: bausteine,
  };
})();
