/* ============================================================================
   Modul-Inhalt: Planen und Organisieren der Arbeit, Bewerten der Ergebnisse
   Rahmenplan: "Planen und Organisieren der Arbeit …" (5 Wo.)
   Verknüpft mit dem Grundkurs Metall (Arbeitsplan zur Halteplatte).
   ==========================================================================*/
window.AZ_CONTENT = window.AZ_CONTENT || {};

AZ_CONTENT["m3-planen-organisieren"] = {
  intro: "Bevor gefertigt wird, wird geplant: Arbeitsschritte festlegen, Material und Werkzeug bereitstellen, " +
    "Reihenfolge und Zeit bestimmen und am Ende das Ergebnis bewerten. Geübt am Werkstück aus dem Grundkurs Metall.",
  bausteine: [
    {
      id: "pl-theorie", typ: "theorie", titel: "Theorie: Arbeitsplanung", blattNr: "PL-T01", render: function () {
        return '<div class="bl-meta"><span>Theorie</span><span>Woche 1</span></div>' +
          '<h3>Der Arbeitsplan</h3><p>Ein Arbeitsplan legt die <strong>Reihenfolge der Arbeitsschritte</strong> fest und ordnet jedem Schritt ' +
          '<strong>Werkzeug/Maschine</strong>, <strong>Prüfmittel</strong> und eine grobe <strong>Zeit</strong> zu. So wird nichts vergessen und die Fertigung ist nachvollziehbar.</p>' +
          '<h3>Reihenfolge (Grundregel)</h3><p>Erst <strong>anreißen</strong>, dann <strong>trennen/spanen</strong> (sägen, feilen), dann <strong>bohren/Gewinde</strong>, zuletzt <strong>entgraten/fasen</strong> und <strong>prüfen</strong>.</p>' +
          '<p class="frage">Frage: Warum bohrt man erst nach dem Anreißen und Körnen? _______________________________</p>';
      },
    },
    {
      id: "pl-arbeitsplan", typ: "praxis", titel: "Übung: Arbeitsplan Halteplatte erstellen", blattNr: "PL-Ü01", render: function () {
        var leer = "";
        for (var i = 1; i <= 6; i++) leer += '<tr><td>' + i + '</td><td>________________________</td><td>____________</td><td>____________</td><td>____</td></tr>';
        return '<div class="bl-meta"><span>Übung</span><span>Woche 2</span><span>Lösung unten</span></div>' +
          '<div class="anknuepf">Werkstück: Halteplatte (GM-190) aus dem Grundkurs Metall.</div>' +
          '<h3>Erstelle den Arbeitsplan</h3><p>Trage die Arbeitsschritte in der richtigen Reihenfolge ein.</p>' +
          '<table class="tab"><thead><tr><th>Nr.</th><th>Arbeitsschritt</th><th>Werkzeug/Maschine</th><th>Prüfmittel</th><th>Zeit</th></tr></thead><tbody>' + leer + '</tbody></table>' +
          '<details class="loesung-box"><summary>Lösung anzeigen</summary>' +
          '<table class="tab"><thead><tr><th>Nr.</th><th>Arbeitsschritt</th><th>Werkzeug/Maschine</th><th>Prüfmittel</th></tr></thead><tbody>' +
          '<tr><td>1</td><td>Rohteil anreißen &amp; körnen</td><td>Höhenreißer, Körner</td><td>Anschlagwinkel</td></tr>' +
          '<tr><td>2</td><td>Außenmaße 90×50 feilen</td><td>Feile</td><td>Messschieber</td></tr>' +
          '<tr><td>3</td><td>Dicke 15 prüfen/richten</td><td>Feile</td><td>Messschieber</td></tr>' +
          '<tr><td>4</td><td>Kernloch 6,8 + ⌀12 bohren, ⌀12 reiben (H9)</td><td>Bohrmaschine, Reibahle</td><td>Grenzlehrdorn</td></tr>' +
          '<tr><td>5</td><td>Gewinde M8 schneiden</td><td>Gewindebohrer-Satz</td><td>Gewindelehrdorn</td></tr>' +
          '<tr><td>6</td><td>Kanten 2×45° fasen, entgraten, endprüfen</td><td>Senker/Feile</td><td>Sicht, Messschieber</td></tr>' +
          '</tbody></table></details>';
      },
    },
    {
      id: "pl-werkzeug", typ: "praxis", titel: "Übung: Material- & Werkzeugliste", blattNr: "PL-Ü02", render: function () {
        return '<div class="bl-meta"><span>Übung</span><span>Woche 3</span></div>' +
          '<h3>Stelle zusammen, was du brauchst</h3>' +
          '<table class="tab"><thead><tr><th>Material</th><th>Menge/Abmessung</th></tr></thead><tbody>' +
          '<tr><td>________________</td><td>________________</td></tr><tr><td>________________</td><td>________________</td></tr></tbody></table>' +
          '<table class="tab" style="margin-top:10px"><thead><tr><th>Werkzeug/Maschine</th><th>Prüfmittel</th></tr></thead><tbody>' +
          '<tr><td>________________</td><td>________________</td></tr><tr><td>________________</td><td>________________</td></tr></tbody></table>' +
          '<details class="loesung-box"><summary>Lösung (Beispiel)</summary><p>Material: Flachstahl S235JR 95×55×18 (Zugabe zum Endmaß). ' +
          'Werkzeug: Feile, Bügelsäge, Bohrmaschine + Bohrer ⌀6,8/⌀12, Reibahle 12H9, Gewindebohrer M8, Senker. Prüfmittel: Messschieber, Grenzlehrdorn 12H9, Gewindelehrdorn M8, Anschlagwinkel.</p></details>';
      },
    },
  ],
};
