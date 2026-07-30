/* ============================================================================
   Modul-Inhalt: Grundkurs Metall (Manuelles & maschinelles Bearbeiten)
   Rahmenplan: "Manuelles u. maschinelles Spanen, Trennen und Umformen" (11 Wo.)
   Berufsschule: Lernfeld 2 "Herstellen mechanischer Teilsysteme"
   Alle Werte belegt (DIN 13 Kernlochdurchmesser, DIN ISO 2768-1 Toleranzen).
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

/* --- Echte Werkstattzeichnung: Führungsplatte 80 x 50 x 10, Bohrung ⌀10 --- */
function azFuehrungsplatte(modus) {
  var voll = (modus === "fertig");
  var b = new AZ.Blatt({
    format: "A4quer", titel: "Führungsplatte", werkstoff: "S235JR",
    nummer: "GM-101", toleranz: "m", ersteller: "Azubi",
  });
  // Weltausschnitt (reale mm) inkl. Platz für Bemaßung -> Engine skaliert genormt
  var world = { x: -18, y: -16, w: 128, h: 94 };
  b.zeichnung(world, function (p) {
    /* Vorderansicht 0..80 x 0..50 */
    p.fill(0, 0, 80, 50);
    p.rect(0, 0, 80, 50, "az-vis");
    p.circle(40, 25, 5, "az-vis");            // Bohrung ⌀10 -> r5
    p.center(40, -5, 40, 55);
    p.center(-5, 25, 85, 25);

    /* Draufsicht (europ. Methode: unter der Vorderansicht) 0..80 x 65..75 */
    p.rect(0, 65, 80, 10, "az-vis");
    p.center(40, 61, 40, 79);
    if (voll) { p.hidden(35, 65, 35, 75); p.hidden(45, 65, 45, 75); }

    /* Seitenansicht von links (rechts) 95..105 x 0..50 */
    if (voll) {
      p.rect(95, 0, 10, 50, "az-vis");
      p.center(91, 25, 109, 25);
      p.hidden(95, 20, 105, 20); p.hidden(95, 30, 105, 30);
    } else {
      p._p('<rect x="' + p.X(95) + '" y="' + p.Y(0) + '" width="' + (10 * p.s).toFixed(2) +
        '" height="' + (50 * p.s).toFixed(2) + '" class="az-thin" stroke-dasharray="1.5 1.5" fill="none"/>');
      p.text(100, 27, "?", "az-todo");
      p.text(94, 60, "Seitenansicht ergänzen", "az-note");
    }

    /* Bemaßung DIN ISO 129-1 */
    if (voll) {
      p.dimH(0, 80, -12, 0);        // 80
      p.dimV(0, 50, -12, 0);        // 50
      p.dimH(95, 105, -12, 0);      // 10 (Tiefe)
      p.dimDia(40, 25, 5, -45, "10"); // ⌀10
    } else {
      p.dimH(0, 80, -12, 0, { text: "?", cls: "az-todo" });
      p.dimV(0, 50, -12, 0, { text: "?", cls: "az-todo" });
      p.dimDia(40, 25, 5, -45, null, { text: "⌀?", cls: "az-todo" });
    }
  });
  return b.svg();
}

AZ_CONTENT["m5-grundkurs-metall"] = {
  intro: "Im Grundkurs Metall fertigst du nach echter technischer Zeichnung ein Werkstück " +
    "und lernst Feilen, Sägen, Bohren, Senken und Gewindeschneiden. Grundlage: Lernfeld 2 " +
    "(Herstellen mechanischer Teilsysteme), Toleranzen nach DIN ISO 2768-1.",
  bausteine: [
    {
      id: "gm-aufgabe", typ: "aufgabe", titel: "Auftrag: Führungsplatte herstellen", blattNr: "GM-A01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Zeitrichtwert: 2 Unterrichtstage</span><span>Rahmenplan: manuelles/maschinelles Bearbeiten</span><span>Lernfeld&nbsp;2</span></div>' +
          '<h3>Die Aufgabe</h3>' +
          '<p>Aus einem Rohteil (Flachstahl 85 × 55 × 12 mm, S235JR) ist die <strong>Führungsplatte</strong> ' +
          'nach Zeichnung <em>GM-101</em> herzustellen: auf Endmaß 80 × 50 × 10 feilen, Bohrung ⌀10 setzen und entgraten.</p>' +
          '<h3>Lernziel</h3>' +
          '<ul class="ul"><li>eine technische Zeichnung richtig lesen (Ansichten, Maße, Toleranzen)</li>' +
          '<li>Werkstück anreißen, körnen, feilen, bohren, entgraten</li>' +
          '<li>Maßhaltigkeit nach <strong>DIN ISO 2768-m</strong> prüfen</li></ul>' +
          '<h3>Ablauf (Prinzip)</h3>' +
          '<ol class="ol"><li><strong>Aufgabe wird erklärt</strong> — dieses Blatt</li>' +
          '<li><strong>Theorie</strong> — Grundlagen Feilen/Bohren/Gewinde (Blatt GM-T01)</li>' +
          '<li><strong>Praxis</strong> — Werkstück fertigen &amp; prüfen (Blatt GM-P01)</li></ol>';
      },
    },
    {
      id: "gm-theorie", typ: "theorie", titel: "Grundlagen: Feilen · Sägen · Bohren · Gewinde", blattNr: "GM-T01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Theorie-Arbeitsblatt</span><span>zu Auftrag GM-A01</span><span>Lösung: GM-L01</span></div>' +
          '<h3>1. Feilen</h3>' +
          '<p>Der Feilenhieb bestimmt den Abtrag: <strong>Schrupphieb (Hieb 1–2)</strong> für groben Abtrag, ' +
          '<strong>Schlichthieb (Hieb 3–4)</strong> für die Endbearbeitung. Kreuzhieb prüfen mit Haarlineal/Anschlag.</p>' +
          '<p class="frage">Frage 1: Womit prüfst du, ob die gefeilte Fläche eben ist? _______________________________</p>' +
          '<h3>2. Sägen</h3>' +
          '<p>Zahnteilung des Sägeblatts nach Werkstückdicke wählen — Faustregel: <strong>mindestens 3 Zähne</strong> ' +
          'sollen gleichzeitig im Eingriff sein, sonst reißt der Zahn aus.</p>' +
          '<p class="frage">Frage 2: Warum mindestens 3 Zähne im Eingriff? _______________________________</p>' +
          '<h3>3. Bohren — Drehzahl berechnen</h3>' +
          '<p>Aus der Schnittgeschwindigkeit v<sub>c</sub> und dem Bohrer-⌀ <em>d</em> ergibt sich die Drehzahl:</p>' +
          '<p class="formel">n = (v<sub>c</sub> · 1000) / (π · d)&nbsp;&nbsp;[min<sup>-1</sup>], &nbsp; d in mm, v<sub>c</sub> in m/min</p>' +
          '<p>Richtwert HSS-Bohrer in S235: v<sub>c</sub> ≈ 35 m/min <span class="chk-hint">(Richtwert — Werkstatt/Tabellenbuch prüfen)</span>.</p>' +
          '<p class="frage">Frage 3: Berechne n für ⌀10 mm bei v<sub>c</sub> = 35 m/min. n = _____________ min<sup>-1</sup></p>' +
          '<h3>4. Gewinde — Kernlochbohrer (metrisches ISO-Regelgewinde, DIN 13)</h3>' +
          '<table class="tab"><thead><tr><th>Gewinde</th><th>Steigung P (mm)</th><th>Kernloch-⌀ (mm)</th></tr></thead><tbody>' +
          '<tr><td>M3</td><td>0,50</td><td>2,5</td></tr>' +
          '<tr><td>M4</td><td>0,70</td><td>3,3</td></tr>' +
          '<tr><td>M5</td><td>0,80</td><td>4,2</td></tr>' +
          '<tr><td>M6</td><td>1,00</td><td>5,0</td></tr>' +
          '<tr><td>M8</td><td>1,25</td><td>6,8</td></tr>' +
          '<tr><td>M10</td><td>1,50</td><td>8,5</td></tr>' +
          '<tr><td>M12</td><td>1,75</td><td>10,2</td></tr></tbody></table>' +
          '<p class="frage">Frage 4: Welchen Kernloch-⌀ bohrst du für ein M6-Gewinde? _____________ mm</p>';
      },
    },
    {
      id: "gm-zeichnung", typ: "zeichnung", titel: "Technische Zeichnung: Führungsplatte (Fertigzeichnung)", blattNr: "GM-101",
      render: function () {
        return '<div class="bl-meta"><span>Dreitafelprojektion · 1. Winkel</span><span>DIN ISO 128 / 129 / 5455</span><span>Maßstab automatisch</span></div>' +
          '<div class="zeichnung-halter">' + azFuehrungsplatte("fertig") + '</div>' +
          '<p class="chk-hint">Reale Maße 80 × 50 × 10 mm · Bohrung ⌀10 · Allgemeintoleranz ISO 2768-m · Werkstoff S235JR.</p>';
      },
    },
    {
      id: "gm-zeichnung-erg", typ: "zeichnung", titel: "Zeichnung ergänzen (halbfertig)", blattNr: "GM-102",
      render: function () {
        return '<div class="bl-meta"><span>zum Ausdrucken &amp; Ergänzen</span><span>Selbstkontrolle: GM-101</span></div>' +
          '<div class="zeichnung-halter">' + azFuehrungsplatte("ergaenzen") + '</div>' +
          '<p class="chk-hint">Aufgabe: fehlende <strong>Maße</strong> eintragen, <strong>Seitenansicht</strong> ergänzen und das <strong>Schriftfeld</strong> ausfüllen. Vergleiche danach mit der Fertigzeichnung GM-101.</p>';
      },
    },
    {
      id: "gm-praxis", typ: "praxis", titel: "Praxis-Arbeitsauftrag: fertigen & prüfen", blattNr: "GM-P01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Praxis</span><span>Werkbank</span><span>Abnahme: Ausbilder</span></div>' +
          '<h3>Arbeitsschritte</h3>' +
          '<div class="chk"><span class="box"></span>PSA anlegen, Arbeitsplatz &amp; Werkzeug vorbereiten</div>' +
          '<div class="chk"><span class="box"></span>Rohteil nach Zeichnung anreißen und körnen</div>' +
          '<div class="chk"><span class="box"></span>Außenmaße 80 × 50 auf Endmaß feilen (Kreuzhieb, dann schlichten)</div>' +
          '<div class="chk"><span class="box"></span>Bohrung ⌀10 anbohren, bohren, beidseitig entgraten/senken</div>' +
          '<h3>Prüfmaße (Sollmaße mit Grenzabmaß nach DIN ISO 2768-m)</h3>' +
          '<table class="tab"><thead><tr><th>Maß</th><th>Sollmaß</th><th>Grenzabmaß ±</th><th>Istmaß</th><th>i.O.</th></tr></thead><tbody>' +
          '<tr><td>Länge</td><td>80 mm</td><td>0,3</td><td>________</td><td>☐</td></tr>' +
          '<tr><td>Breite</td><td>50 mm</td><td>0,3</td><td>________</td><td>☐</td></tr>' +
          '<tr><td>Dicke</td><td>10 mm</td><td>0,2</td><td>________</td><td>☐</td></tr>' +
          '<tr><td>Bohrung</td><td>⌀10 mm</td><td>0,2</td><td>________</td><td>☐</td></tr></tbody></table>' +
          '<p class="chk-hint">Grenzabmaße aus ISO 2768-m: >6–30 mm → ±0,2 · >30–120 mm → ±0,3.</p>' +
          '<div class="unterschrift"><div>Azubi: __________________</div><div>Ausbilder: __________________</div><div>Datum: ____________</div></div>';
      },
    },
    {
      id: "gm-loesung", typ: "loesung", titel: "Lösungsheft: Grundkurs Metall", blattNr: "GM-L01",
      render: function () {
        return '' +
          '<div class="bl-meta ok"><span>Lösungsheft</span><span>zu GM-T01 / GM-101 / GM-P01</span><span>Musterlösung</span></div>' +
          '<h3>Theorie (GM-T01)</h3>' +
          '<ol class="ol"><li><strong>Frage 1:</strong> Mit Haarlineal / Anschlagwinkel gegen das Licht prüfen (Lichtspalt).</li>' +
          '<li><strong>Frage 2:</strong> Bei weniger als 3 Zähnen im Eingriff hakt der Zahn im Werkstück und bricht aus.</li>' +
          '<li><strong>Frage 3:</strong> n = (35 · 1000) / (π · 10) = 35000 / 31,42 ≈ <strong>1114 min<sup>-1</sup></strong> ' +
          '(gewählte Maschinendrehzahl entsprechend nächstniedriger Stufe).</li>' +
          '<li><strong>Frage 4:</strong> M6 → Kernloch-⌀ <strong>5,0 mm</strong> (DIN 13).</li></ol>' +
          '<h3>Zeichnung (GM-101)</h3>' +
          '<p>Maße: Länge 80, Breite 50, Tiefe 10, Bohrung ⌀10 mittig (40/25). Projektion 1. Winkel, ' +
          'Seitenansicht rechts, Draufsicht unten. Allgemeintoleranz ISO 2768-m.</p>' +
          '<h3>Praxis (GM-P01) — Sollmaße</h3>' +
          '<p>80 ±0,3 · 50 ±0,3 · 10 ±0,2 · ⌀10 ±0,2. Werkstück i.O., wenn alle Istmaße im Grenzabmaß liegen und Kanten gratfrei sind.</p>';
      },
    },
  ],
};
