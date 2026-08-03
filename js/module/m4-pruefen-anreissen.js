/* ============================================================================
   Modul-Inhalt: Prüfen, Anreißen und Kennzeichnen
   Rahmenplan: "Prüfen, Anreißen und Kennzeichnen" (3 Wo.)
   Mit Messschieber-Ablese-Übung (Nonius 1/20) und Toleranzberechnung.
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

AZ_CONTENT["m4-pruefen-anreissen"] = {
  intro: "Messen, prüfen, anreißen und kennzeichnen — die Grundlage für maßhaltiges Arbeiten. Du lernst den " +
    "Messschieber (Nonius) und die Bügelmessschraube ablesen und Grenzabmaße nach DIN ISO 2768 bestimmen.",
  bausteine: [
    {
      id: "pr-theorie", typ: "theorie", titel: "Theorie: Messmittel & Toleranzen", blattNr: "PR-T01", render: function () {
        return '<div class="bl-meta"><span>Theorie</span><span>Woche 1</span><span>DIN ISO 2768 / EN ISO 286</span></div>' +
          '<h3>Messschieber (Nonius)</h3><p>Ablesegenauigkeit je Ausführung: 1/10 → 0,1 mm, 1/20 → <strong>0,05 mm</strong>, 1/50 → 0,02 mm. ' +
          'Ganze mm an der Hauptskala (vor der Nonius-Null), Nachkommastelle dort, wo eine Nonius-Linie mit einer Hauptlinie <strong>fluchtet</strong>.</p>' +
          '<h3>Bügelmessschraube</h3><p>Skalenwert 0,01 mm (Spindelsteigung 0,5 mm, Trommel 50 Teile). Immer mit Ratsche messen.</p>' +
          '<h3>Anreißen &amp; Kennzeichnen</h3><p>Mit Höhenreißer/Reißnadel und Anschlagwinkel anreißen, Bohrmitten <strong>körnen</strong>, Teile dauerhaft kennzeichnen (Schlagzahlen).</p>' +
          '<p class="frage">Frage: Welche Ablesegenauigkeit hat ein Nonius 1/20? __________ mm</p>';
      },
    },
    {
      id: "pr-messen", typ: "praxis", titel: "Übung: Messschieber ablesen", blattNr: "PR-Ü01", render: function () {
        var werte = [23.40, 41.65, 57.25];
        var blocks = werte.map(function (v, i) {
          return '<p style="margin-top:14px"><strong>Ablesung ' + (i + 1) + ':</strong> Wert = __________ mm</p>' +
            '<div class="msch-halter">' + azMessschieber(v) + '</div>';
        }).join("");
        return '<div class="bl-meta"><span>Übung</span><span>Woche 1</span><span>Nonius 1/20 = 0,05 mm</span></div>' +
          '<h3>Lies die drei Messschieber ab</h3><p>Ganze mm an der oberen (Haupt-)Skala vor dem roten Zeiger; die Hundertstel dort, wo die orange markierte Nonius-Linie mit einer Hauptlinie fluchtet.</p>' +
          blocks +
          '<details class="loesung-box"><summary>Lösung anzeigen</summary><ol class="ol">' +
          '<li>23,40 mm</li><li>41,65 mm</li><li>57,25 mm</li></ol></details>';
      },
    },
    {
      id: "pr-toleranz", typ: "praxis", titel: "Übung: Grenzabmaße bestimmen (ISO 2768-m)", blattNr: "PR-Ü02", render: function () {
        return '<div class="bl-meta"><span>Übung</span><span>Woche 2</span><span>DIN ISO 2768-1</span></div>' +
          '<h3>Bestimme die Grenzabmaße (Klasse mittel)</h3>' +
          '<table class="tab"><thead><tr><th>Nennmaß</th><th>Bereich</th><th>Grenzabmaß ±</th><th>Höchstmaß</th><th>Mindestmaß</th></tr></thead><tbody>' +
          '<tr><td>8 mm</td><td>______</td><td>______</td><td>______</td><td>______</td></tr>' +
          '<tr><td>45 mm</td><td>______</td><td>______</td><td>______</td><td>______</td></tr>' +
          '<tr><td>150 mm</td><td>______</td><td>______</td><td>______</td><td>______</td></tr></tbody></table>' +
          '<details class="loesung-box"><summary>Lösung anzeigen</summary>' +
          '<table class="tab"><thead><tr><th>Nennmaß</th><th>Bereich</th><th>±</th><th>Höchstmaß</th><th>Mindestmaß</th></tr></thead><tbody>' +
          '<tr><td>8</td><td>>6–30</td><td>0,2</td><td>8,2</td><td>7,8</td></tr>' +
          '<tr><td>45</td><td>>30–120</td><td>0,3</td><td>45,3</td><td>44,7</td></tr>' +
          '<tr><td>150</td><td>>120–400</td><td>0,5</td><td>150,5</td><td>149,5</td></tr></tbody></table></details>';
      },
    },
  ],
};
