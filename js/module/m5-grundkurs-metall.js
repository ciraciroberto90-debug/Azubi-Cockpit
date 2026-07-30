/* ============================================================================
   Modul-Inhalt: Grundkurs Metall (Manuelles & maschinelles Bearbeiten)
   Rahmenplan: "Manuelles u. maschinelles Spanen, Trennen und Umformen" (11 Wo.)
   Berufsschule: Lernfeld 2 "Herstellen mechanischer Teilsysteme"
   Werkstück: Halteplatte 90 x 50 x 15, Bohrung ⌀12 H9, Gewinde M8, Fase 2x45°.
   Alle Werte belegt: DIN 13 (Kernloch), DIN EN ISO 286 (H9), DIN ISO 2768-1.
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

/* --- Echte Werkstattzeichnung mit Schnitt A–A --- */
function azHalteplatte(modus) {
  var voll = (modus === "fertig");
  var b = new AZ.Blatt({
    format: "A4quer", titel: "Halteplatte", werkstoff: "S235JR",
    nummer: "GM-101", toleranz: "m", ersteller: "Azubi",
  });
  var world = { x: -16, y: -18, w: 120, h: 112 };
  b.zeichnung(world, function (p) {
    /* ---------------- Vorderansicht ---------------- */
    p.fill(0, 0, 90, 50);
    p.rect(0, 0, 90, 50, "az-vis");
    p.circle(25, 25, 6, "az-vis");                 // Bohrung ⌀12 H9
    if (voll) p.gewindeFront(65, 25, 8, 6.8);      // Gewinde M8
    else p.text(64.5, 26.5, "?", "az-todo");
    p.center(25, -5, 25, 55); p.center(65, -5, 65, 55); p.center(-5, 25, 95, 25);
    if (voll) p.schnittlinie(-6, 96, 25, "A");     // Schnittverlauf A–A

    /* ---------------- Schnitt A–A (unter der Vorderansicht) ---------------- */
    if (voll) {
      var outline = [[0, 67], [2, 65], [88, 65], [90, 67], [90, 80], [0, 80]]; // Fase 2x45° oben
      var bore = [[19, 65], [31, 65], [31, 80], [19, 80]];       // ⌀12 Durchgang
      var thr = [[61.6, 65], [68.4, 65], [68.4, 80], [61.6, 80]]; // M8 Kernloch ⌀6,8
      p.hatchPoly(outline, [bore, thr], 2.4);
      p.poly(outline, "az-vis");
      p.line(19, 65, 19, 80, "az-vis"); p.line(31, 65, 31, 80, "az-vis");   // Bohrung
      p.line(61.6, 65, 61.6, 80, "az-vis"); p.line(68.4, 65, 68.4, 80, "az-vis"); // Gewindekern (breit)
      p.line(61, 65, 61, 80, "az-thin"); p.line(69, 65, 69, 80, "az-thin");       // Nenn-⌀ (schmal)
      p.center(25, 63, 25, 82); p.center(65, 63, 65, 82);
      p.text(38, 90, "SCHNITT A–A", "az-lblb");
    } else {
      p._p('<rect x="' + p.X(0) + '" y="' + p.Y(65) + '" width="' + (90 * p.s).toFixed(2) +
        '" height="' + (15 * p.s).toFixed(2) + '" class="az-thin" stroke-dasharray="1.5 1.5" fill="none"/>');
      p.text(34, 74, "Schnitt A–A ergänzen", "az-note");
    }

    /* ---------------- Bemaßung DIN ISO 129-1 ---------------- */
    if (voll) {
      p.dimH(0, 90, -16, 0);                     // 90 Breite
      p.dimH(0, 25, -8, 0);                      // 25 Position Bohrung
      p.dimH(25, 65, -8, 0);                     // 40 Lochabstand
      p.dimV(0, 50, -14, 0);                     // 50 Höhe
      p.dimV(65, 80, 96, 90);                    // 15 Dicke (im Schnitt)
      p.dimDia(25, 25, 6, -132, "12", { text: "⌀12 H9" });
      p.dimDia(65, 25, 4, -48, null, { text: "M8" });
      // Fase 2x45° (Hinweis am Schnitt)
      p.line(2, 65, -6, 61, "az-thin"); p.text(-14, 60.5, "2×45°", "az-dimtx");
      // Oberflächenangabe Ra 3,2 an Vorderseite
      p.oberflaeche(80, 50, "3,2");
    } else {
      p.dimH(0, 90, -16, 0, { text: "?", cls: "az-todo" });
      p.dimV(0, 50, -14, 0, { text: "?", cls: "az-todo" });
      p.dimDia(25, 25, 6, -132, null, { text: "⌀?", cls: "az-todo" });
    }
  });
  return b.svg();
}

AZ_CONTENT["m5-grundkurs-metall"] = {
  intro: "Im Grundkurs Metall fertigst du nach echter technischer Zeichnung die Halteplatte und " +
    "lernst Feilen, Sägen, Bohren, Senken und Gewindeschneiden. Die Zeichnung enthält eine " +
    "Passbohrung (⌀12 H9), ein Gewinde (M8), eine Fase (2×45°) und einen Schnitt A–A. " +
    "Grundlage: Lernfeld 2, Toleranzen nach DIN ISO 2768-1 und DIN EN ISO 286.",
  bausteine: [
    {
      id: "gm-aufgabe", typ: "aufgabe", titel: "Auftrag: Halteplatte herstellen", blattNr: "GM-A01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Zeitrichtwert: 3 Unterrichtstage</span><span>Rahmenplan: manuelles/maschinelles Bearbeiten</span><span>Lernfeld&nbsp;2</span></div>' +
          '<h3>Die Aufgabe</h3>' +
          '<p>Aus einem Rohteil (Flachstahl 95 × 55 × 18 mm, S235JR) ist die <strong>Halteplatte</strong> nach Zeichnung ' +
          '<em>GM-101</em> herzustellen: auf Endmaß 90 × 50 × 15 feilen, Passbohrung <strong>⌀12 H9</strong> und ' +
          'Gewinde <strong>M8</strong> setzen, Kanten mit Fase <strong>2×45°</strong> brechen.</p>' +
          '<h3>Lernziel</h3>' +
          '<ul class="ul"><li>eine technische Zeichnung mit Schnitt, Passung und Gewinde lesen</li>' +
          '<li>anreißen, körnen, feilen, bohren, senken, Gewinde schneiden, entgraten</li>' +
          '<li>Maßhaltigkeit nach <strong>DIN ISO 2768-m</strong> und Passung <strong>H9</strong> prüfen</li></ul>' +
          '<h3>Ablauf</h3>' +
          '<ol class="ol"><li><strong>Aufgabe erklärt</strong> — dieses Blatt</li>' +
          '<li><strong>Theorie</strong> — Feilen/Bohren/Gewinde, Passung, Oberfläche (GM-T01)</li>' +
          '<li><strong>Praxis</strong> — fertigen &amp; prüfen (GM-P01)</li></ol>';
      },
    },
    {
      id: "gm-theorie", typ: "theorie", titel: "Grundlagen: Feilen · Bohren · Gewinde · Passung · Oberfläche", blattNr: "GM-T01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Theorie-Arbeitsblatt</span><span>zu Auftrag GM-A01</span><span>Lösung: GM-L01</span></div>' +
          '<h3>1. Feilen</h3>' +
          '<p>Schrupphieb für groben Abtrag, Schlichthieb für die Endbearbeitung; Ebenheit im Kreuzhieb prüfen.</p>' +
          '<p class="frage">Frage 1: Womit prüfst du, ob die gefeilte Fläche eben ist? _______________________________</p>' +
          '<h3>2. Sägen</h3>' +
          '<p>Faustregel: mindestens <strong>3 Zähne</strong> gleichzeitig im Eingriff, sonst reißt der Zahn aus.</p>' +
          '<p class="frage">Frage 2: Warum mindestens 3 Zähne im Eingriff? _______________________________</p>' +
          '<h3>3. Bohren — Drehzahl berechnen</h3>' +
          '<p class="formel">n = (v<sub>c</sub> · 1000) / (π · d)&nbsp;&nbsp;[min<sup>-1</sup>]</p>' +
          '<p>Richtwert HSS in S235: v<sub>c</sub> ≈ 35 m/min <span class="chk-hint">(Richtwert — Tabellenbuch prüfen)</span>.</p>' +
          '<p class="frage">Frage 3: Berechne n für die Bohrung ⌀12 mm bei v<sub>c</sub> = 35 m/min. n = __________ min<sup>-1</sup></p>' +
          '<h3>4. Gewinde — Kernlochbohrer (metrisches ISO-Regelgewinde, DIN 13)</h3>' +
          '<table class="tab"><thead><tr><th>Gewinde</th><th>Steigung P (mm)</th><th>Kernloch-⌀ (mm)</th></tr></thead><tbody>' +
          '<tr><td>M4</td><td>0,70</td><td>3,3</td></tr><tr><td>M5</td><td>0,80</td><td>4,2</td></tr>' +
          '<tr><td>M6</td><td>1,00</td><td>5,0</td></tr><tr><td><strong>M8</strong></td><td>1,25</td><td><strong>6,8</strong></td></tr>' +
          '<tr><td>M10</td><td>1,50</td><td>8,5</td></tr></tbody></table>' +
          '<p class="frage">Frage 4: Welchen Kernloch-⌀ bohrst du für das Gewinde M8? __________ mm</p>' +
          '<h3>5. Passung — ⌀12 H9 (DIN EN ISO 286)</h3>' +
          '<p>Das Toleranzfeld <strong>H</strong> hat das untere Abmaß <strong>0</strong>; die Qualität <strong>9 (IT9)</strong> ' +
          'beträgt für 10–18 mm <strong>43 µm</strong>. Damit gilt: ⌀12 H9 = <strong>+0,043 / 0 mm</strong>.</p>' +
          '<p class="frage">Frage 5: Welche Grenzabmaße hat ⌀12 H9? oberes: __________ &nbsp; unteres: __________</p>' +
          '<h3>6. Oberfläche &amp; Fase</h3>' +
          '<p><strong>Ra 3,2</strong> = arithmetischer Mittenrauwert in µm (DIN EN ISO 21920). ' +
          '<strong>2×45°</strong> = gebrochene Kante, 2 mm Fasenbreite unter 45°.</p>' +
          '<p class="frage">Frage 6: Was bedeutet die Angabe „Ra 3,2"? _______________________________</p>';
      },
    },
    {
      id: "gm-zeichnung", typ: "zeichnung", titel: "Technische Zeichnung: Halteplatte (Fertigzeichnung)", blattNr: "GM-101",
      render: function () {
        return '<div class="bl-meta"><span>Dreitafelprojektion + Schnitt A–A</span><span>DIN ISO 128 / 129 / 5455 / 286</span><span>Maßstab automatisch</span></div>' +
          '<div class="zeichnung-halter">' + azHalteplatte("fertig") + '</div>' +
          '<p class="chk-hint">Reale Maße 90 × 50 × 15 mm · Bohrung ⌀12 H9 (+0,043/0) · Gewinde M8 · Fase 2×45° · Ra 3,2 · Allgemeintoleranz ISO 2768-m · S235JR.</p>';
      },
    },
    {
      id: "gm-zeichnung-erg", typ: "zeichnung", titel: "Zeichnung ergänzen (halbfertig)", blattNr: "GM-102",
      render: function () {
        return '<div class="bl-meta"><span>zum Ausdrucken &amp; Ergänzen</span><span>Selbstkontrolle: GM-101</span></div>' +
          '<div class="zeichnung-halter">' + azHalteplatte("ergaenzen") + '</div>' +
          '<p class="chk-hint">Aufgabe: fehlende <strong>Maße</strong> eintragen, <strong>Gewinde M8</strong> und <strong>Schnitt A–A</strong> ergänzen, ' +
          'Passung &amp; Fase angeben und das <strong>Schriftfeld</strong> ausfüllen. Danach mit GM-101 vergleichen.</p>';
      },
    },
    {
      id: "gm-praxis", typ: "praxis", titel: "Praxis-Arbeitsauftrag: fertigen & prüfen", blattNr: "GM-P01",
      render: function () {
        return '' +
          '<div class="bl-meta"><span>Praxis</span><span>Werkbank</span><span>Abnahme: Ausbilder</span></div>' +
          '<h3>Arbeitsschritte</h3>' +
          '<div class="chk"><span class="box"></span>PSA anlegen, Arbeitsplatz &amp; Werkzeug vorbereiten</div>' +
          '<div class="chk"><span class="box"></span>Rohteil nach Zeichnung anreißen und körnen (Lochmitten 25 / 65)</div>' +
          '<div class="chk"><span class="box"></span>Außenmaße 90 × 50 auf Endmaß feilen, Dicke 15 prüfen</div>' +
          '<div class="chk"><span class="box"></span>Kernloch ⌀6,8 bohren, Gewinde M8 schneiden (Schneideisen/Bohrer)</div>' +
          '<div class="chk"><span class="box"></span>Passbohrung ⌀12 H9 bohren &amp; reiben, Kanten 2×45° brechen</div>' +
          '<h3>Prüfmaße (Sollmaße mit Grenzabmaß)</h3>' +
          '<table class="tab"><thead><tr><th>Maß</th><th>Sollmaß</th><th>Grenzabmaß</th><th>Prüfmittel</th><th>Ist</th><th>i.O.</th></tr></thead><tbody>' +
          '<tr><td>Länge</td><td>90 mm</td><td>±0,3 (2768-m)</td><td>Messschieber</td><td>____</td><td>☐</td></tr>' +
          '<tr><td>Breite</td><td>50 mm</td><td>±0,3 (2768-m)</td><td>Messschieber</td><td>____</td><td>☐</td></tr>' +
          '<tr><td>Dicke</td><td>15 mm</td><td>±0,2 (2768-m)</td><td>Messschieber</td><td>____</td><td>☐</td></tr>' +
          '<tr><td>Passbohrung</td><td>⌀12 H9</td><td>+0,043 / 0</td><td>Grenzlehrdorn</td><td>____</td><td>☐</td></tr>' +
          '<tr><td>Gewinde</td><td>M8</td><td>—</td><td>Gewindelehrdorn</td><td>____</td><td>☐</td></tr></tbody></table>' +
          '<p class="chk-hint">Grenzabmaße: ISO 2768-m (>6–30 → ±0,2 · >30–120 → ±0,3); ⌀12 H9 nach DIN EN ISO 286.</p>' +
          '<div class="unterschrift"><div>Azubi: __________________</div><div>Ausbilder: __________________</div><div>Datum: ____________</div></div>';
      },
    },
    {
      id: "gm-loesung", typ: "loesung", titel: "Lösungsheft: Grundkurs Metall", blattNr: "GM-L01",
      render: function () {
        return '' +
          '<div class="bl-meta ok"><span>Lösungsheft</span><span>zu GM-T01 / GM-101 / GM-P01</span><span>Musterlösung</span></div>' +
          '<h3>Theorie (GM-T01)</h3>' +
          '<ol class="ol">' +
          '<li><strong>F1:</strong> Mit Haarlineal / Anschlagwinkel gegen das Licht (Lichtspalt) prüfen.</li>' +
          '<li><strong>F2:</strong> Bei &lt; 3 Zähnen im Eingriff hakt der Zahn und bricht aus.</li>' +
          '<li><strong>F3:</strong> n = (35 · 1000) / (π · 12) = 35000 / 37,70 ≈ <strong>928 min<sup>-1</sup></strong>.</li>' +
          '<li><strong>F4:</strong> M8 → Kernloch-⌀ <strong>6,8 mm</strong> (DIN 13).</li>' +
          '<li><strong>F5:</strong> ⌀12 H9 → oberes Abmaß <strong>+0,043 mm</strong>, unteres <strong>0 mm</strong> (Istmaß 12,000…12,043).</li>' +
          '<li><strong>F6:</strong> Ra 3,2 = arithmetischer Mittenrauwert der Oberfläche = 3,2 µm (DIN EN ISO 21920).</li>' +
          '</ol>' +
          '<h3>Zeichnung (GM-101)</h3>' +
          '<p>Maße 90 × 50 × 15; Bohrung ⌀12 H9 bei (25/25), Gewinde M8 bei (65/25), Lochabstand 40; Fase 2×45°; ' +
          'Schnitt A–A zeigt Durchgangsbohrung und Gewinde im Kern. Projektion 1. Winkel, Allgemeintoleranz ISO 2768-m.</p>' +
          '<h3>Praxis (GM-P01)</h3>' +
          '<p>Werkstück i.O., wenn: 90 ±0,3 · 50 ±0,3 · 15 ±0,2 · ⌀12 in +0,043/0 (Grenzlehrdorn „Gut" geht, „Ausschuss" nicht) · ' +
          'M8 mit Gewindelehrdorn geprüft · Kanten gratfrei &amp; gefast.</p>';
      },
    },
  ],
};
