/* ============================================================================
   Modul-Inhalt: Arbeits- & Gesundheitsschutz, Umweltschutz
   Rahmenplan: "Sicherheit u. Gesundheitsschutz bei der Arbeit" (durchgängig)
   Berufsschule: u. a. Lernfeld 3 (sicherheitstechnische Aspekte)
   Sicherheitszeichen normgerecht nach DIN EN ISO 7010 / ISO 3864
   (Form + Sicherheitsfarbe + genormte Piktogramme mit Registriernummer).
   Gefährdungsbeurteilung ArbSchG §5 (TOP-Prinzip). Sachlich belegt.
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

/* Sicherheitsfarben ISO 3864 */
var AZ_SIG = { blau: "#005387", rot: "#c8161d", gelb: "#f6c700", gruen: "#237a3a", schwarz: "#101010", weiss: "#ffffff" };

/* Genormte Piktogramme (DIN EN ISO 7010) – als SVG nachgebildet.
   kind -> {svg, code, name}                                                    */
function azSign(kind) {
  var B = AZ_SIG, s = "", code = "", name = "";
  function gebot(inner) { return '<circle cx="24" cy="24" r="22" fill="' + B.blau + '"/>' + inner; }
  function verbot(inner) { return '<circle cx="24" cy="24" r="22" fill="#fff"/>' + inner +
    '<circle cx="24" cy="24" r="20" fill="none" stroke="' + B.rot + '" stroke-width="4"/>' +
    '<line x1="10.5" y1="37.5" x2="37.5" y2="10.5" stroke="' + B.rot + '" stroke-width="4"/>'; }
  switch (kind) {
    case "augenschutz": // M004 — Schutzbrille
      code = "M004"; name = "Augenschutz benutzen";
      s = gebot('<g fill="#fff">' +
        '<path d="M8 22 q0-3 3-3 h8 q3 0 3 3 v3 q0 3-3 3 h-8 q-3 0-3-3 z"/>' +
        '<path d="M40 22 q0-3 -3-3 h-8 q-3 0 -3 3 v3 q0 3 3 3 h8 q3 0 3-3 z"/>' +
        '<rect x="22" y="21" width="4" height="3"/></g>' +
        '<path d="M8 21 L4 18 M40 21 L44 18" stroke="#fff" stroke-width="2" fill="none"/>');
      break;
    case "gehoerschutz": // M003 — Kapselgehörschützer
      code = "M003"; name = "Gehörschutz benutzen";
      s = gebot('<path d="M12 28 a12 12 0 0 1 24 0" fill="none" stroke="#fff" stroke-width="3.2"/>' +
        '<circle cx="24" cy="29" r="7.5" fill="#fff"/>' +
        '<rect x="9.5" y="25.5" width="6.5" height="9.5" rx="3" fill="#fff"/>' +
        '<rect x="32" y="25.5" width="6.5" height="9.5" rx="3" fill="#fff"/>');
      break;
    case "fussschutz": // M008 — Sicherheitsschuh (Profil)
      code = "M008"; name = "Fußschutz benutzen";
      s = gebot('<path d="M16 13 h6 v14 l16 4.5 v4.5 h-22 z" fill="#fff"/>' +
        '<line x1="15" y1="34" x2="38" y2="34" stroke="' + B.blau + '" stroke-width="1.4"/>');
      break;
    case "handschuhverbot": // P028 — Benutzen von Handschuhen verboten
      code = "P028"; name = "Benutzen von Handschuhen verboten";
      s = verbot('<g fill="' + B.schwarz + '">' +
        '<path d="M18 34 v-9 h12 v9 z"/>' +
        '<rect x="18.4" y="15" width="2.6" height="11" rx="1.3"/>' +
        '<rect x="21.6" y="13.5" width="2.6" height="12.5" rx="1.3"/>' +
        '<rect x="24.7" y="13.5" width="2.6" height="12.5" rx="1.3"/>' +
        '<rect x="27.8" y="15" width="2.6" height="11" rx="1.3"/>' +
        '<path d="M18 27 l-4.5 -2.2 a2 2 0 0 1 1.8 -3.6 l3.4 1.7 z"/></g>');
      break;
    case "warnung": // W001 allgemeines Warnzeichen
      code = "W001"; name = "Allgemeines Warnzeichen";
      s = '<path d="M24 4 L44 39 H4 Z" fill="' + B.gelb + '" stroke="' + B.schwarz + '" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<rect x="22" y="16" width="4" height="12" fill="' + B.schwarz + '"/><rect x="22" y="31" width="4" height="4" fill="' + B.schwarz + '"/>';
      break;
    case "ersthilfe": // E003
      code = "E003"; name = "Erste Hilfe";
      s = '<rect x="3" y="3" width="42" height="42" rx="3" fill="' + B.gruen + '"/>' +
        '<path d="M20 11 h8 v9 h9 v8 h-9 v9 h-8 v-9 h-9 v-8 h9 z" fill="#fff"/>';
      break;
    case "feuerloescher": // F001
      code = "F001"; name = "Feuerlöscher";
      s = '<rect x="3" y="3" width="42" height="42" rx="3" fill="' + B.rot + '"/>' +
        '<g fill="#fff"><rect x="18" y="17" width="12" height="21" rx="3"/><rect x="21.5" y="11" width="5" height="6" rx="1"/></g>' +
        '<path d="M26 13 q7 0 7 7" stroke="#fff" stroke-width="2" fill="none"/>';
      break;
  }
  // Wenn eine offizielle, lizenzierte Datei hinterlegt ist -> diese verwenden.
  var official = (window.AZ_SIGN_OVERRIDES || {})[code];
  var svg = official
    ? '<span class="sign sign-official" role="img" aria-label="' + name + '">' + official + "</span>"
    : '<svg viewBox="0 0 48 48" class="sign" role="img" aria-label="' + name + '">' + s + "</svg>";
  return { svg: svg, code: code, name: name, official: !!official };
}
function azSignCard(kind) {
  var x = azSign(kind);
  return '<div class="sign-card">' + x.svg + '<div><strong>' + x.name + '</strong><small>ISO 7010 · ' + x.code + '</small></div></div>';
}

AZ_CONTENT["m1-arbeitssicherheit"] = {
  intro: "Sicherheit ist die Grundlage jeder Tätigkeit in der Werkstatt und begleitet die gesamte Ausbildung. " +
    "Du lernst Sicherheitszeichen nach DIN EN ISO 7010 zu lesen, die PSA richtig einzusetzen und Gefährdungen " +
    "nach ArbSchG §5 (TOP-Prinzip) zu beurteilen.",
  bausteine: [
    {
      id: "as-aufgabe", typ: "aufgabe", titel: "Unterweisung: Sicher arbeiten von Anfang an", blattNr: "AS-A01",
      render: function () {
        return '<div class="bl-meta"><span>Grundkurs / durchgängig</span><span>Rahmenplan: Sicherheit u. Gesundheitsschutz</span><span>Bezug LF&nbsp;3</span></div>' +
          '<h3>Warum zuerst?</h3><p>Bevor du an Maschine oder Werkbank arbeitest, musst du Gefährdungen erkennen und die richtigen ' +
          'Schutzmaßnahmen anwenden. Dieses Modul ist die Voraussetzung für alle weiteren Aufgaben.</p>' +
          '<h3>Lernziel</h3><ul class="ul"><li>Sicherheitszeichen nach Form, Farbe &amp; Piktogramm (ISO 7010) deuten</li>' +
          '<li>die passende persönliche Schutzausrüstung (PSA) auswählen</li>' +
          '<li>eine einfache Gefährdungsbeurteilung nach dem TOP-Prinzip durchführen</li></ul>' +
          '<h3>Ablauf</h3><ol class="ol"><li><strong>Aufgabe erklärt</strong> — dieses Blatt</li>' +
          '<li><strong>Theorie</strong> — Sicherheitszeichen, PSA, Gefährdungsbeurteilung (AS-T01)</li>' +
          '<li><strong>Praxis</strong> — Sicherheits-Checkliste am Arbeitsplatz (AS-S01)</li></ol>';
      },
    },
    {
      id: "as-theorie", typ: "theorie", titel: "Sicherheitszeichen · PSA · Gefährdungsbeurteilung", blattNr: "AS-T01",
      render: function () {
        return '<div class="bl-meta"><span>Theorie-Arbeitsblatt</span><span>DIN EN ISO 7010 · ArbSchG §5</span><span>Lösung: AS-L01</span></div>' +
          '<h3>1. Sicherheitszeichen — Form, Farbe &amp; Piktogramm (DIN EN ISO 7010 / ISO 3864)</h3>' +
          '<table class="tab"><thead><tr><th>Kategorie</th><th>Form &amp; Farbe</th><th>Bedeutung</th></tr></thead><tbody>' +
          '<tr><td><strong>Verbot</strong></td><td>Kreis, rot, Diagonalbalken</td><td>etwas ist untersagt</td></tr>' +
          '<tr><td><strong>Gebot</strong></td><td>Kreis, blau</td><td>Verhalten vorgeschrieben (PSA)</td></tr>' +
          '<tr><td><strong>Warnung</strong></td><td>Dreieck, gelb, schwarzer Rand</td><td>vor Gefahr warnen</td></tr>' +
          '<tr><td><strong>Rettung</strong></td><td>Quadrat, grün</td><td>Rettungsweg/Erste Hilfe</td></tr>' +
          '<tr><td><strong>Brandschutz</strong></td><td>Quadrat, rot</td><td>Brandschutzeinrichtung</td></tr></tbody></table>' +
          '<p style="margin-top:10px">Genormte Piktogramme (Auswahl Metallwerkstatt):</p>' +
          '<div class="sign-grid">' +
          azSignCard("augenschutz") + azSignCard("gehoerschutz") + azSignCard("fussschutz") +
          azSignCard("handschuhverbot") + azSignCard("warnung") + azSignCard("ersthilfe") + azSignCard("feuerloescher") +
          '</div>' +
          '<p class="chk-hint">Offizielle Piktogramme nach DIN EN ISO 7010 (Registriernummern) — Grafiken MIT-lizenziert.</p>' +
          '<p class="frage">Frage 1: Welche Form und Farbe hat ein Gebotszeichen (z. B. „Augenschutz benutzen“)? ____________________</p>' +
          '<h3>2. Persönliche Schutzausrüstung (PSA)</h3>' +
          '<p>Typisch in der Metallwerkstatt: <strong>Schutzbrille, Sicherheitsschuhe, Gehörschutz</strong>. ' +
          '<span class="chk-hint">Achtung: an rotierenden Maschinen (Bohrmaschine) sind Handschuhe verboten — ISO 7010 P028.</span></p>' +
          '<p class="frage">Frage 2: Warum trägst du an der Bohrmaschine keine Handschuhe? ____________________________________</p>' +
          '<h3>3. Gefährdungsbeurteilung (ArbSchG §5) — TOP-Prinzip</h3>' +
          '<table class="tab"><thead><tr><th>Rang</th><th>Art</th><th>Beispiel</th></tr></thead><tbody>' +
          '<tr><td>T</td><td><strong>Technisch</strong></td><td>Schutzabdeckung, Absaugung</td></tr>' +
          '<tr><td>O</td><td><strong>Organisatorisch</strong></td><td>Unterweisung, Betriebsanweisung</td></tr>' +
          '<tr><td>P</td><td><strong>Personenbezogen</strong></td><td>PSA (Brille, Schuhe)</td></tr></tbody></table>' +
          '<p class="frage">Frage 3: In welcher Reihenfolge werden Maßnahmen bevorzugt? ____ vor ____ vor ____</p>';
      },
    },
    {
      id: "as-check", typ: "sicherheit", titel: "Sicherheits-Checkliste am Arbeitsplatz", blattNr: "AS-S01",
      render: function () {
        return '<div class="bl-meta"><span>Praxis / Sicherheit</span><span>vor Arbeitsbeginn ausfüllen</span></div>' +
          '<h3>Vor dem Arbeiten prüfen</h3>' +
          '<div class="chk"><span class="box"></span>PSA vollständig: Schutzbrille, Sicherheitsschuhe, Gehörschutz</div>' +
          '<div class="chk"><span class="box"></span>Not-Aus-Schalter / Standort bekannt</div>' +
          '<div class="chk"><span class="box"></span>Maschine sauber, Schutzeinrichtungen vorhanden &amp; wirksam</div>' +
          '<div class="chk"><span class="box"></span>Arbeitsplatz aufgeräumt, keine Stolperstellen</div>' +
          '<div class="chk"><span class="box"></span>Fluchtwege &amp; Feuerlöscher (ISO 7010 F001) frei zugänglich</div>' +
          '<h3>Gefährdung notieren &amp; Maßnahme (TOP)</h3>' +
          '<table class="tab"><thead><tr><th>Gefährdung</th><th>Maßnahme</th><th>Rang (T/O/P)</th></tr></thead><tbody>' +
          '<tr><td>________________</td><td>________________</td><td>____</td></tr>' +
          '<tr><td>________________</td><td>________________</td><td>____</td></tr></tbody></table>' +
          '<div class="unterschrift"><div>Azubi: __________________</div><div>Ausbilder: __________________</div><div>Datum: ____________</div></div>';
      },
    },
    {
      id: "as-loesung", typ: "loesung", titel: "Lösungsheft: Arbeitssicherheit", blattNr: "AS-L01",
      render: function () {
        return '<div class="bl-meta ok"><span>Lösungsheft</span><span>zu AS-T01</span><span>Musterlösung</span></div>' +
          '<ol class="ol">' +
          '<li><strong>Frage 1:</strong> Gebotszeichen = <strong>runder Kreis, blau</strong>, weißes Piktogramm (z. B. Augenschutz, ISO 7010 M004).</li>' +
          '<li><strong>Frage 2:</strong> Handschuhe können vom rotierenden Bohrer erfasst und die Hand eingezogen werden — daher Verbot (ISO 7010 P028).</li>' +
          '<li><strong>Frage 3:</strong> <strong>T</strong>echnisch vor <strong>O</strong>rganisatorisch vor <strong>P</strong>ersonenbezogen (TOP, ArbSchG §5).</li>' +
          '</ol>' +
          '<p class="chk-hint">Konkrete betriebliche Vorschriften/Grenzwerte ergänzt die Ausbildung mit den gültigen DGUV-Regeln (fachlich prüfen).</p>';
      },
    },
  ],
};
