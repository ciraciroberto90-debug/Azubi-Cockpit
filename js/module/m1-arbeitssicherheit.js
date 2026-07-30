/* ============================================================================
   Modul-Inhalt: Arbeits- & Gesundheitsschutz, Umweltschutz
   Rahmenplan: "Sicherheit u. Gesundheitsschutz bei der Arbeit" (durchgängig)
   Berufsschule: bezieht sich u. a. auf Lernfeld 3 (sicherheitstechnische Aspekte)
   Grundlagen: DIN EN ISO 7010 (Sicherheitszeichen), ArbSchG §5 (Gefährdungs-
   beurteilung, TOP-Prinzip), DGUV. Sachlich belegt.
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

/* Sicherheitszeichen-Kategorien (Form + Sicherheitsfarbe nach ISO 3864/7010) */
function azSignChip(kind) {
  var s = { W: "#c8161d", B: "#005387", Y: "#f6c700", G: "#2e7d32" };
  switch (kind) {
    case "verbot": return '<svg viewBox="0 0 40 40" class="sign"><circle cx="20" cy="20" r="16" fill="#fff" stroke="' + s.W + '" stroke-width="4"/><line x1="9" y1="31" x2="31" y2="9" stroke="' + s.W + '" stroke-width="4"/></svg>';
    case "gebot": return '<svg viewBox="0 0 40 40" class="sign"><circle cx="20" cy="20" r="18" fill="' + s.B + '"/><circle cx="20" cy="13" r="4" fill="#fff"/><rect x="16" y="18" width="8" height="12" rx="2" fill="#fff"/></svg>';
    case "warnung": return '<svg viewBox="0 0 40 40" class="sign"><path d="M20 4 L37 34 L3 34 Z" fill="' + s.Y + '" stroke="#111" stroke-width="2.5"/><rect x="18.5" y="15" width="3" height="10" fill="#111"/><rect x="18.5" y="27" width="3" height="3" fill="#111"/></svg>';
    case "rettung": return '<svg viewBox="0 0 40 40" class="sign"><rect x="3" y="3" width="34" height="34" rx="2" fill="' + s.G + '"/><path d="M12 20 l6 6 l10 -12" stroke="#fff" stroke-width="4" fill="none"/></svg>';
    case "brand": return '<svg viewBox="0 0 40 40" class="sign"><rect x="3" y="3" width="34" height="34" rx="2" fill="' + s.W + '"/><path d="M20 8 c4 6 8 8 8 14 a8 8 0 0 1 -16 0 c0 -4 4 -6 8 -14 z" fill="#fff"/></svg>';
  }
  return "";
}

AZ_CONTENT["m1-arbeitssicherheit"] = {
  intro: "Sicherheit ist die Grundlage jeder Tätigkeit in der Werkstatt und begleitet die " +
    "gesamte Ausbildung. Du lernst Sicherheitszeichen zu lesen (DIN EN ISO 7010), die " +
    "PSA richtig einzusetzen und Gefährdungen nach ArbSchG §5 zu beurteilen.",
  bausteine: [
    {
      id: "as-aufgabe", typ: "aufgabe", titel: "Unterweisung: Sicher arbeiten von Anfang an", blattNr: "AS-A01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Grundkurs / durchgängig</span><span>Rahmenplan: Sicherheit u. Gesundheitsschutz</span><span>Bezug LF&nbsp;3</span></div>' +
          '<h3>Warum zuerst?</h3>' +
          '<p>Bevor du an Maschine oder Werkbank arbeitest, musst du Gefährdungen erkennen und die richtigen ' +
          'Schutzmaßnahmen anwenden. Dieses Modul ist die Voraussetzung für alle weiteren Aufgaben.</p>' +
          '<h3>Lernziel</h3>' +
          '<ul class="ul"><li>Sicherheitszeichen nach ihrer Form &amp; Farbe deuten</li>' +
          '<li>die passende persönliche Schutzausrüstung (PSA) auswählen</li>' +
          '<li>eine einfache Gefährdungsbeurteilung nach dem TOP-Prinzip durchführen</li></ul>' +
          '<h3>Ablauf</h3>' +
          '<ol class="ol"><li><strong>Aufgabe erklärt</strong> — dieses Blatt</li>' +
          '<li><strong>Theorie</strong> — Sicherheitszeichen, PSA, Gefährdungsbeurteilung (AS-T01)</li>' +
          '<li><strong>Praxis</strong> — Sicherheits-Checkliste am Arbeitsplatz (AS-S01)</li></ol>';
      },
    },
    {
      id: "as-theorie", typ: "theorie", titel: "Sicherheitszeichen · PSA · Gefährdungsbeurteilung", blattNr: "AS-T01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Theorie-Arbeitsblatt</span><span>DIN EN ISO 7010 · ArbSchG §5</span><span>Lösung: AS-L01</span></div>' +
          '<h3>1. Sicherheitszeichen nach Form und Farbe (DIN EN ISO 7010 / ISO 3864)</h3>' +
          '<div class="sign-grid">' +
          '<div class="sign-card">' + azSignChip("verbot") + '<div><strong>Verbot</strong><small>Kreis, rot, Diagonalbalken</small></div></div>' +
          '<div class="sign-card">' + azSignChip("gebot") + '<div><strong>Gebot</strong><small>Kreis, blau</small></div></div>' +
          '<div class="sign-card">' + azSignChip("warnung") + '<div><strong>Warnung</strong><small>Dreieck, gelb, schwarzer Rand</small></div></div>' +
          '<div class="sign-card">' + azSignChip("rettung") + '<div><strong>Rettung</strong><small>Quadrat, grün</small></div></div>' +
          '<div class="sign-card">' + azSignChip("brand") + '<div><strong>Brandschutz</strong><small>Quadrat, rot</small></div></div>' +
          '</div>' +
          '<p class="frage">Frage 1: Welche Form und Farbe hat ein <em>Gebotszeichen</em> (z. B. „Augenschutz benutzen")? ____________________</p>' +
          '<h3>2. Persönliche Schutzausrüstung (PSA)</h3>' +
          '<p>Die PSA schützt dort, wo technische und organisatorische Maßnahmen nicht ausreichen. Typisch in der ' +
          'Metallwerkstatt: <strong>Schutzbrille, Sicherheitsschuhe, Gehörschutz</strong>, ggf. Handschuhe ' +
          '(<span class="chk-hint">Achtung: an rotierenden Maschinen wie der Bohrmaschine keine Handschuhe!</span>).</p>' +
          '<p class="frage">Frage 2: Warum trägst du an der Bohrmaschine keine Handschuhe? ____________________________________</p>' +
          '<h3>3. Gefährdungsbeurteilung (ArbSchG §5) — TOP-Prinzip</h3>' +
          '<p>Schutzmaßnahmen werden in dieser Rangfolge festgelegt:</p>' +
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
        return '' +
          '<div class="bl-meta"><span>Praxis / Sicherheit</span><span>vor Arbeitsbeginn ausfüllen</span></div>' +
          '<h3>Vor dem Arbeiten prüfen</h3>' +
          '<div class="chk"><span class="box"></span>PSA vollständig: Schutzbrille, Sicherheitsschuhe, Gehörschutz</div>' +
          '<div class="chk"><span class="box"></span>Not-Aus-Schalter / Standort bekannt</div>' +
          '<div class="chk"><span class="box"></span>Maschine sauber, Schutzeinrichtungen vorhanden &amp; wirksam</div>' +
          '<div class="chk"><span class="box"></span>Arbeitsplatz aufgeräumt, keine Stolperstellen</div>' +
          '<div class="chk"><span class="box"></span>Fluchtwege &amp; Feuerlöscher frei zugänglich</div>' +
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
        return '' +
          '<div class="bl-meta ok"><span>Lösungsheft</span><span>zu AS-T01</span><span>Musterlösung</span></div>' +
          '<ol class="ol">' +
          '<li><strong>Frage 1:</strong> Gebotszeichen = <strong>runder Kreis, blau</strong>, weißes Symbol (z. B. Schutzbrille).</li>' +
          '<li><strong>Frage 2:</strong> Handschuhe können vom rotierenden Bohrer erfasst und die Hand eingezogen werden — hohe Verletzungsgefahr.</li>' +
          '<li><strong>Frage 3:</strong> <strong>T</strong>echnisch vor <strong>O</strong>rganisatorisch vor <strong>P</strong>ersonenbezogen (TOP-Prinzip, ArbSchG §5).</li>' +
          '</ol>' +
          '<p class="chk-hint">Konkrete betriebliche Vorschriften und Grenzwerte ergänzt die Ausbildung mit den gültigen DGUV-Regeln / Betriebsanweisungen (fachlich prüfen).</p>';
      },
    },
  ],
};
