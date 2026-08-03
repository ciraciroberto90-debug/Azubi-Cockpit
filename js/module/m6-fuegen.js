/* ============================================================================
   Modul-Inhalt: Zusammenbauen und Verbinden von Bauteilen (Fügen)
   Rahmenplan: "Zusammenbauen u. Verbinden von Bauteilen u. Baugruppen" (4 Wo.)
   Verknüpft mit der Projekt-Reihe (Haltewinkel verschrauben).
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

AZ_CONTENT["m6-fuegen"] = {
  intro: "Fügen heißt Bauteile verbinden. Du lernst lösbare und unlösbare Verbindungen kennen und montierst " +
    "eine Schraubverbindung am Projekt-Werkstück (Haltewinkel).",
  bausteine: [
    {
      id: "fu-theorie", typ: "theorie", titel: "Theorie: Verbindungsarten", blattNr: "FU-T01", render: function () {
        return '<div class="bl-meta"><span>Theorie</span><span>Woche 1</span></div>' +
          '<h3>Lösbar oder unlösbar?</h3>' +
          '<table class="tab"><thead><tr><th>Art</th><th>Beispiele</th><th>lösbar?</th></tr></thead><tbody>' +
          '<tr><td>Schrauben</td><td>Schraube + Mutter + Scheibe, Gewinde</td><td>ja (zerstörungsfrei)</td></tr>' +
          '<tr><td>Stecken/Klemmen</td><td>Stift, Passfeder, Klemmung</td><td>ja</td></tr>' +
          '<tr><td>Nieten</td><td>Vollniet, Blindniet</td><td>nein</td></tr>' +
          '<tr><td>Löten/Schweißen/Kleben</td><td>Weichlöten, MAG-Schweißen</td><td>nein</td></tr></tbody></table>' +
          '<h3>Schraubverbindung</h3><p>Reihenfolge: <strong>Schraube – Scheibe – Bauteile – ggf. Scheibe – Mutter</strong>. Die Scheibe verteilt die Kraft und schützt die Oberfläche. Sicherung gegen Losdrehen z. B. durch Federring oder selbstsichernde Mutter.</p>' +
          '<p class="frage">Frage 1: Nenne zwei unlösbare Verbindungen. ____________________</p>' +
          '<p class="frage">Frage 2: Wozu dient die Unterlegscheibe? ____________________</p>';
      },
    },
    {
      id: "fu-zuordnen", typ: "praxis", titel: "Übung: Verbindungen zuordnen", blattNr: "FU-Ü01", render: function () {
        return '<div class="bl-meta"><span>Übung</span><span>Woche 2</span></div>' +
          '<h3>Ordne „lösbar“ (L) oder „unlösbar“ (U) zu</h3>' +
          '<table class="tab"><thead><tr><th>Verbindung</th><th>L / U</th></tr></thead><tbody>' +
          '<tr><td>Schraube + Mutter</td><td>____</td></tr><tr><td>Blindniet</td><td>____</td></tr>' +
          '<tr><td>Weichlöten</td><td>____</td></tr><tr><td>Passfeder</td><td>____</td></tr>' +
          '<tr><td>MAG-Schweißnaht</td><td>____</td></tr><tr><td>Klemmverbindung</td><td>____</td></tr></tbody></table>' +
          '<details class="loesung-box"><summary>Lösung anzeigen</summary><p>Schraube+Mutter = L · Blindniet = U · Weichlöten = U · Passfeder = L · Schweißnaht = U · Klemmung = L.</p></details>';
      },
    },
    {
      id: "fu-montage", typ: "praxis", titel: "Übung: Haltewinkel verschrauben", blattNr: "FU-Ü02", render: function () {
        return '<div class="bl-meta"><span>Übung / Montage</span><span>Woche 3</span></div>' +
          '<div class="anknuepf">Baut auf der Projekt-Reihe auf: Grundplatte (GM-P2) + Anbauwinkel (GM-P3).</div>' +
          '<h3>Montage-Schritte</h3>' +
          '<div class="chk"><span class="box"></span>Bohrungen von Grundplatte und Winkel zur Deckung bringen</div>' +
          '<div class="chk"><span class="box"></span>Schraube M6 mit Scheibe von unten durchstecken</div>' +
          '<div class="chk"><span class="box"></span>Winkel auflegen, Scheibe + Mutter aufsetzen</div>' +
          '<div class="chk"><span class="box"></span>handfest anziehen, Rechtwinkligkeit prüfen, dann festziehen</div>' +
          '<h3>Prüfung</h3>' +
          '<table class="tab"><thead><tr><th>Merkmal</th><th>Soll</th><th>Prüfmittel</th><th>i.O.</th></tr></thead><tbody>' +
          '<tr><td>Rechtwinkligkeit</td><td>90° ±1°</td><td>Haarwinkel</td><td>☐</td></tr>' +
          '<tr><td>Verschraubung fest</td><td>—</td><td>Sicht/Hand</td><td>☐</td></tr></tbody></table>' +
          '<div class="unterschrift"><div>Azubi: __________________</div><div>Ausbilder: __________________</div><div>Datum: ____________</div></div>';
      },
    },
  ],
};
